import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManageService } from '../shared/data-manager.service';
import { HowTo } from '../shared/howto.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AutoScrollComponent } from '../shared/auto-scroll.component';
import { ToastrService } from 'ngx-toastr';
import { faTrashAlt, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-edit-how-to',
  templateUrl: './edit-how-to.component.html',
  styleUrls: ['./edit-how-to.component.css']
})
export class EditHowToComponent extends AutoScrollComponent implements OnInit, OnDestroy {

  howtoID: string;
  howto$: HowTo;
  howtoForm: FormGroup;
  publishCheck = true;
  fileToUpload: File;
  showUploadPrompt = false;
  faCalendarDay = faCalendarDay;
  faTrashAlt = faTrashAlt;
  curFile = 'Choose File';

  getSingleHowtoSub: Subscription;
  addImageSub: Subscription;
  removeImageSub: Subscription;
  deleteHowtoSub: Subscription;
  editHowToSub: Subscription;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private dataManager: DataManageService,
    private fb: FormBuilder,
    private toast: ToastrService) { super() }

  ngOnInit() {
    this.getHowToEdit()
  }

  public getHowToEdit(): void {
    this.howtoID = this.route.snapshot.paramMap.get('howtoID');
    this.getSingleHowtoSub = this.dataManager.getSingleHowTo(this.howtoID).subscribe(res => {
      this.howto$ = res
      this.howtoForm = this.fb.group({
        photo: null,
        id: this.howtoID,
        title: new FormControl(this.howto$.title,
          [
          ]
        ),
        subject: new FormControl(this.howto$.subject, [

        ]),
        publish: new FormControl(),
        introduction: new FormControl(this.howto$.introduction, [

        ]),
        content: new FormControl(this.howto$.content, [
        ])
      });
    })
  }

  public deleteHowTo(): void {
    this.deleteHowtoSub = this.dataManager.deleteHowTo(this.howtoID).subscribe(res => {
      this.router.navigate(['/how-tos'])
    })
  }

  public editHowTo(): void {
    const edited_form = this.howtoForm.value;
    if (!edited_form.title || ["/", "&", ":", "\\", "-"].some(x => edited_form.title.indexOf(x) !== -1)) {
      this.toast.warning('* Title is required and cannot contain \\ / & : -', 'Notice');
    } else if (!edited_form.content) {
      this.toast.warning('* Content is required', 'Notice');
    } else if (!edited_form.subject) {
      this.toast.warning('* Subject is required', 'Notice');
    } else if (!edited_form.introduction) {
      this.toast.warning('* Introduction is required', 'Notice');
    } else {
      const fd = new FormData();
      fd.append('title', edited_form.title !== null ? edited_form.title : '')
      fd.append('content', edited_form.content !== null ? edited_form.content : '')
      fd.append('subject', edited_form.subject !== null ? edited_form.subject : '')
      fd.append('publish', edited_form.publish !== null ? edited_form.publish : false)
      fd.append('introduction', edited_form.introduction !== null ? edited_form.introduction : '')
      fd.append('imageSource', edited_form.imageSource !== null ? edited_form.imageSource : [])
      fd.append('id', edited_form.id)
      this.editHowToSub = this.dataManager.editHowTo(fd).subscribe(res => {
        this.goBack();
      })
    }
  }

  public goBack(): void {
    this.router.navigate(['/how-tos'])
  }

  public onFileSelect(event): void {
    this.fileToUpload = event.target.files[0] as File;
    this.howtoForm.value.Photo = this.fileToUpload;
    this.showUploadPrompt = true
  }

  public uploadImage(): void {
    const fd = new FormData();
    if (this.fileToUpload) {
      fd.append('id', this.howto$.id);
      fd.append('image1', this.fileToUpload, this.fileToUpload.name)
      this.addImageSub = this.dataManager.addHowToImages(fd).subscribe(res => {
        this.getHowToEdit()
        this.showUploadPrompt = false
        this.fileToUpload = null
      })
    } else {
      this.toast.warning('Provide a file to upload.', 'Notice');
    }
  }

  public removeImage(urlSource: string): void {
    if (this.howto$.imageSource.length !== 1) {
      const fd = new FormData();
      fd.append('urlSource', urlSource);
      fd.append('id', this.howto$.id);
      this.removeImageSub = this.dataManager.removeHowToImage(fd).subscribe(res => {
        this.getHowToEdit();
      });
    } else {
      this.toast.warning('* Cannot delete. Main Photo is required', 'Notice');
    }
  }


  ngOnDestroy() {
    if (this.getSingleHowtoSub) {
      this.getSingleHowtoSub.unsubscribe();
    }
    if (this.addImageSub) {
      this.addImageSub.unsubscribe();
    }
    if (this.removeImageSub) {
      this.removeImageSub.unsubscribe();
    }
    if (this.deleteHowtoSub) {
      this.deleteHowtoSub.unsubscribe();
    }
    if (this.editHowToSub) {
      this.editHowToSub.unsubscribe();
    }
  }

}
