import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DataManageService } from '../shared/data-manager.service';
import { Router } from '@angular/router';
import { Email } from '../shared/emails.model';
import { ToastrService } from 'ngx-toastr';
import { faMailBulk, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnDestroy {

  public emailform: FormGroup;
  public emails$: Email[];
  public emptySubscriptionList = false;
  faMailBulk = faMailBulk;
  faPaperPlane = faPaperPlane;

  sendEmailSub: Subscription;
  getEmailSub: Subscription;

  constructor(private datamanager: DataManageService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService) { }

  ngOnInit() {
    const oneDayMili = 1000 * 60 * 60 * 24;

    this.emailform = this.fb.group({
      subject: new FormControl(""),
      content: new FormControl(""),

    })
    this.getEmailSub = this.datamanager.getAllEmails().subscribe(res => {
      this.emails$ = res
      if (this.emails$) {
        for (let i = 0; i < this.emails$.length; i++) {
          let curElement = this.emails$[i];
          const daysSubscribed = (new Date().getTime() - new Date(curElement.createDate.replace(
            /-/g, '/') + ' UTC').getTime()) / oneDayMili;

          curElement.daysSubscribed = Math.floor(Math.abs(daysSubscribed));
        }
      } else {
        this.emptySubscriptionList = true;
      }
    })
  }

  public formSubmit() {
    const subjectField = this.emailform.value.subject;
    const contentField = this.emailform.value.content;
    if (!subjectField) {
      this.toast.warning("Subject is required", 'Notice');
    } else if (!contentField) {
      this.toast.warning("Content is required", 'Notice');
    } else {
      const fd = new FormData();
      fd.append('subject', this.emailform.value.subject);
      fd.append('content', this.emailform.value.content);
      this.sendEmailSub = this.datamanager.sendEmail(fd).subscribe(
        res => {
          this.router.navigate(['/'])
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.sendEmailSub) {
      this.sendEmailSub.unsubscribe();
    }
    if (this.getEmailSub) {
      this.getEmailSub.unsubscribe();
    }
  }

}
