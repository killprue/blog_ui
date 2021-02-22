import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataManageService } from '../shared/data-manager.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeInfo } from '../shared/home-info.model';
import { ToastrService } from 'ngx-toastr';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-edit-home-page',
  templateUrl: './edit-home-page.component.html',
  styleUrls: ['./edit-home-page.component.css']
})
export class EditHomePageComponent implements OnInit, OnDestroy {

  homePageForm: FormGroup;
  homePageInfo: HomeInfo;
  filesToUpload: Object = {};
  faTrashAlt = faTrashAlt;
  curFileMain: string;
  curFile1: string;
  curFile2: string;
  curFile3: string;
  curFile4: string;
  curFile5: string;

  getHomePageSub: Subscription;
  editHomePageSub: Subscription;
  addHomeImageSub: Subscription;
  removeHomeImageSub: Subscription;


  constructor(private dataManager: DataManageService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService) {
  }

  ngOnInit() {
    this.curFile1 =
      this.curFile2 =
      this.curFile3 =
      this.curFile4 =
      this.curFile5 =
      this.curFileMain =
      'Choose File';
    this.getHomePageToEdit();
  }

  public getHomePageToEdit() {
    this.getHomePageSub = this.dataManager.getHomePage().subscribe(res => {
      this.homePageForm = this.fb.group({
        mainSection: new FormControl(res.mainSection),
        mainSectionPhoto: null,
        section1: new FormControl(res.section1),
        section1Photo: null,
        section2: new FormControl(res.section2),
        section2Photo: null,
        section3: new FormControl(res.section3),
        section3Photo: null,
        section4: new FormControl(res.section4),
        section4Photo: null,
        section5: new FormControl(res.section5),
        section5Photo: null
      })
      this.homePageInfo = res
    })
  }

  public submitEdit() {
    const fd = new FormData();
    fd.append('mainSection', this.homePageForm.value.mainSection);
    fd.append('section1', this.homePageForm.value.section1);
    fd.append('section2', this.homePageForm.value.section2);
    fd.append('section3', this.homePageForm.value.section3);
    fd.append('section4', this.homePageForm.value.section4);
    fd.append('section5', this.homePageForm.value.section5);
    this.editHomePageSub = this.dataManager.editHomePage(fd).subscribe(res => {
      this.router.navigate(['/home'])
    },
      err => {
        console.error(err)
      })
  }


  public onFileSelect(event, section): void {
    if (section == 0) {
      this.filesToUpload["mainSectionImageSource"] = event.target.files[0] as File;
      if (event.target.files[0]) {
        this.homePageForm.value.mainSectionPhoto = this.filesToUpload[section];
        this.curFileMain = event.target.files[0].name
      } else {
        this.curFileMain = 'Choose File';
      }
    }
    else {
      if (event.target.files[0]) {
        this.filesToUpload[`section${section}ImageSource`] = event.target.files[0] as File;
        this.homePageForm.value.mainSectionPhoto = this.filesToUpload[section];
        this.addFileName(section, event.target.files[0].name);
      } else {
        this.resetFileSelect(section);
      }
    }
  }


  public uploadImage(section: number): void {
    const fd = new FormData();
    let selectedFileToUpload = '';
    let fieldName = '';

    if (section == 0) {
      fieldName = "mainSectionImageSource";
      selectedFileToUpload = this.filesToUpload[fieldName];
    } else {
      fieldName = `section${section}ImageSource`;
      selectedFileToUpload = this.filesToUpload[fieldName];
    }

    if (selectedFileToUpload) {
      fd.append(fieldName, selectedFileToUpload);

      this.addHomeImageSub = this.dataManager.addHomePageImage(fd).subscribe(res => {
        this.addNewUrl(section, res.newUrl);
        this.resetFileSelect(section);
      }, err => {
        this.toast.warning(`${err.error.message}`, 'Notice');
        this.resetFileSelect(section);
      });
    } else {
      this.toast.warning('Provide a file to upload.', 'Notice');
    }
  }

  public removeImage(urlSource: string, section) {
    const fd = new FormData();
    fd.append("urlSource", urlSource);
    this.removeHomeImageSub = this.dataManager.removeHomePageImage(fd).subscribe(res => {
      this.removeUrl(section, urlSource);
    });
  }


  private addFileName(section: number, fileName: string) {
    switch (section) {
      case 1:
        this.curFile1 = fileName;
        break;
      case 2:
        this.curFile2 = fileName;
        break;
      case 3:
        this.curFile3 = fileName;
        break;
      case 4:
        this.curFile4 = fileName;
        break;
      case 5:
        this.curFile5 = fileName;
        break;
      default:
        break;
    }
  }


  private removeUrl(section, url) {
    switch (section) {
      case 0:
        this.homePageInfo.mainSectionImageSource.splice(this.homePageInfo.mainSectionImageSource.indexOf(url), 1);
        break;
      case 1:
        this.homePageInfo.section1ImageSource.splice(this.homePageInfo.section1ImageSource.indexOf(url), 1);
        break;
      case 2:
        this.homePageInfo.section2ImageSource.splice(this.homePageInfo.section2ImageSource.indexOf(url), 1);
        break;
      case 3:
        this.homePageInfo.section3ImageSource.splice(this.homePageInfo.section3ImageSource.indexOf(url), 1);
        break;
      case 4:
        this.homePageInfo.section4ImageSource.splice(this.homePageInfo.section4ImageSource.indexOf(url), 1);
        break;
      case 5:
        this.homePageInfo.section5ImageSource.splice(this.homePageInfo.section5ImageSource.indexOf(url), 1);
        break;
      default:
        break;
    }
  }

  private addNewUrl(section, url) {
    switch (section) {
      case 0:
        this.homePageInfo.mainSectionImageSource.push(url);
        break;
      case 1:
        this.homePageInfo.section1ImageSource.push(url);
        break;
      case 2:
        this.homePageInfo.section2ImageSource.push(url);
        break;
      case 3:
        this.homePageInfo.section3ImageSource.push(url);
        break;
      case 4:
        this.homePageInfo.section4ImageSource.push(url);
        break;
      case 5:
        this.homePageInfo.section5ImageSource.push(url);
        break;
      default:
        break;
    }
  }

  private resetFileSelect(section) {
    switch (section) {
      case 0:
        this.curFileMain = 'Choose File';
        if (this.filesToUpload['mainSectionImageSource']) {
          delete this.filesToUpload['mainSectionImageSource'];
        }

      case 1:
        this.curFile1 = 'Choose File';
        if (this.filesToUpload[`section${section}ImageSource`]) {
          delete this.filesToUpload[`section${section}ImageSource`];
        }
        break;
      case 2:
        this.curFile2 = 'Choose File';
        if (this.filesToUpload[`section${section}ImageSource`]) {
          delete this.filesToUpload[`section${section}ImageSource`];
        }
        break;
      case 3:
        this.curFile3 = 'Choose File';
        if (this.filesToUpload[`section${section}ImageSource`]) {
          delete this.filesToUpload[`section${section}ImageSource`];
        }
        break;
      case 4:
        this.curFile4 = 'Choose File';
        if (this.filesToUpload[`section${section}ImageSource`]) {
          delete this.filesToUpload[`section${section}ImageSource`];
        }
        break;
      case 5:
        this.curFile5 = 'Choose File';
        if (this.filesToUpload[`section${section}ImageSource`]) {
          delete this.filesToUpload[`section${section}ImageSource`];
        }
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    if (this.getHomePageSub) {
      this.getHomePageSub.unsubscribe();
    }
    if (this.editHomePageSub) {
      this.editHomePageSub.unsubscribe();
    }
    if (this.addHomeImageSub) {
      this.addHomeImageSub.unsubscribe();
    }
    if (this.removeHomeImageSub) {
      this.removeHomeImageSub.unsubscribe();
    }

  }

}
