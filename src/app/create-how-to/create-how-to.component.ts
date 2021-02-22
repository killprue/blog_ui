import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataManageService } from '../shared/data-manager.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-how-to',
  templateUrl: './create-how-to.component.html',
  styleUrls: ['./create-how-to.component.css']
})
export class CreateHowToComponent implements OnInit, OnDestroy {
  fileToUpload: File;
  howtoForm: FormGroup;
  curFile = 'Choose File';
  createHowToSub: Subscription;

  constructor(private dataManager: DataManageService, private fb: FormBuilder,
    private router: Router, private toast: ToastrService) { }

  ngOnInit() {
    this.howtoForm = this.fb.group({
      photo: null,
      title: new FormControl('',
        [
          Validators.required, Validators.maxLength(500)
        ]
      ),
      subject: new FormControl('',
        [
          Validators.required, Validators.maxLength(8000)
        ]),
      introduction: new FormControl('',
        [
          Validators.required, Validators.maxLength(8000)
        ]),
      content: new FormControl('', [
        Validators.required, Validators.maxLength(8000)
      ])
    });

  }

  public createNewHowTo() {
    const filledForm = this.howtoForm.value;
    if (!filledForm.title || ["/", "&", ":", "\\", "-"].some(x => filledForm.title.indexOf(x) !== -1)) {
      this.toast.warning('* Title is required and cannot contain \\ / & : -', 'Notice');
    } else if (!filledForm.content) {
      this.toast.warning('* Content is required', 'Notice');
    } else if (!filledForm.subject) {
      this.toast.warning('* Subject is required', 'Notice');
    } else if (!filledForm.introduction) {
      this.toast.warning('* Introduction is required', 'Notice');
    } else if (!this.fileToUpload) {
      this.toast.warning('* Main Photo is required', 'Notice');
    } else {
      const fd = new FormData();
      fd.append('file', this.fileToUpload, this.fileToUpload.name);
      fd.append('title', this.howtoForm.value.title);
      fd.append('subject', this.howtoForm.value.subject);
      fd.append('introduction', this.howtoForm.value.introduction);
      fd.append('content', this.howtoForm.value.content);

      this.createHowToSub = this.dataManager.createHowTo(fd).subscribe(
        res => {
          this.router.navigate(['/how-tos'])
        })
    }
  }

  public onFileSelect(event): void {
    this.fileToUpload = event.target.files[0] as File;
    this.howtoForm.value.Photo = this.fileToUpload;
    this.curFile = this.fileToUpload ? this.fileToUpload.name : "Choose File";
  }

  ngOnDestroy() {
    if (this.createHowToSub) {
      this.createHowToSub.unsubscribe();
    }
  }

}
