import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManageService } from '../shared/data-manager.service';
import { Post } from '../shared/post.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AutoScrollComponent } from '../shared/auto-scroll.component';
import { } from 'googlemaps';
import { ToastrService } from 'ngx-toastr';
import { faTrashAlt, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent extends AutoScrollComponent implements OnInit, AutoScrollComponent, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  @ViewChild('location', { static: false }) location: ElementRef;
  map: google.maps.Map;

  datePicker;
  faCalendarDay = faCalendarDay;
  faTrashAlt = faTrashAlt;
  preventResubmit: boolean;
  postID: string;
  post$: Post;
  postForm: FormGroup;
  fileToUpload: File;
  curFile = "Choose file";

  singlePostSub: Subscription;
  deletePostSub: Subscription;
  editPostSub: Subscription;
  addPostImageSub: Subscription;
  removePostImageSub: Subscription;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private dataManager: DataManageService,
    private fb: FormBuilder,
    private toast: ToastrService) { super() }

  ngOnInit() {
    this.getPostToEdit();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  public getPostToEdit(): void {
    this.postID = this.route.snapshot.paramMap.get('postID');
    this.singlePostSub = this.dataManager.getSinglePost(this.postID).subscribe(res => {
      this.post$ = res;

      const [year, month, day] = res.createDate.split("T")[0].split("-").map(x => parseInt(x));
      this.location.nativeElement.value = this.post$.location;
      this.postForm = this.fb.group({
        photo: null,
        id: this.postID,
        title: new FormControl(this.post$.title),
        publish: new FormControl(),
        content: new FormControl(this.post$.content),
        albumLink: new FormControl(this.post$.albumLink),
        datePicker: new FormControl({ year, month, day })
      });
    })
  }

  public deletePost(): void {
    this.deletePostSub = this.dataManager.deletePost(this.postID).subscribe(res => {
      this.router.navigate(['/posts'])
    })
  }

  public editPost(): void {
    this.preventResubmit = true;
    const edited_form = this.postForm.value;

    if (!edited_form.title || ["/", "&", ":", "\\", "-"].some(x => edited_form.title.indexOf(x) !== -1)) {
      this.preventResubmit = false;
      this.toast.warning('* Title is required and cannot contain \\ / & : -', 'Notice');
    } else if (!this.location.nativeElement.value || ["/", "&", ":", "\\", "-"].some(x => this.location.nativeElement.value.indexOf(x) !== -1)) {
      this.preventResubmit = false;
      this.toast.warning('* Location is required and cannot contain \\ / & : -', 'Notice');
    }
    else if (!edited_form.content) {
      this.preventResubmit = false;
      this.toast.warning('* Content is required.', 'Notice');
    } else {
      const fd = new FormData();
      fd.append('title', edited_form.title !== null ? edited_form.title : '')
      fd.append('content', edited_form.content !== null ? edited_form.content : '')
      fd.append('location', this.location.nativeElement.value !== null ? this.location.nativeElement.value : '')
      fd.append('publish', edited_form.publish !== null ? edited_form.publish : false)
      fd.append('imageSource', edited_form.imageSource !== null ? edited_form.imageSource : [])
      fd.append('id', edited_form.id)
      fd.append('albumLink', edited_form.albumLink);
      this.editPostSub = this.dataManager.editPost(fd).subscribe(res => {
        this.goBack();
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/posts'])
  }

  public onFileSelect(event): void {
    this.fileToUpload = event.target.files[0] as File;
    this.postForm.value.Photo = this.fileToUpload;
    this.curFile = this.fileToUpload ? this.fileToUpload.name : "Choose File";
  }

  public uploadImage(): void {
    const fd = new FormData();
    if (this.fileToUpload) {

      if (this.addPostImageSub) {
        this.addPostImageSub.unsubscribe();
      }

      fd.append('id', this.post$.id);
      fd.append('image1', this.fileToUpload, this.fileToUpload.name)

      this.addPostImageSub = this.dataManager.addPostImages(fd).subscribe(res => {
        this.post$.imageSource.push(res.newUrl);
        this.fileToUpload = null
        this.curFile = "Choose File";
      }, err => {
        this.fileToUpload = null;
        this.toast.warning(`${err.error.message}`, 'Notice');
        this.curFile = "Choose File";
      })
    } else {
      this.toast.warning('Provide a file to upload.', 'Notice');
    }
  }

  public removeImage(urlSource: string): void {
    if (this.post$.imageSource.length !== 1) {

      if (this.removePostImageSub) {
        this.removePostImageSub.unsubscribe();
      }

      const fd = new FormData();
      fd.append('urlSource', urlSource);
      fd.append('id', this.post$.id);

      this.removePostImageSub = this.dataManager.removePostImage(fd).subscribe(res => {
        this.post$.imageSource.splice(this.post$.imageSource.indexOf(urlSource), 1);
      })
    } else {
      this.toast.warning('* Cannot delete. Main Photo is required', 'Notice');
    }
  }


  initMap() {
    this.map = new google.maps.Map(this.gmap.nativeElement, {
      center: { lat: 42.278913, lng: -102.554078 },
      zoom: 4
    });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input') as HTMLInputElement;
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', this.map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(this.map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function () {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    document.getElementById('use-strict-bounds')
      .addEventListener('click', function () {
        autocomplete.setOptions({ strictBounds: (this as HTMLInputElement).checked });
      });
  }


  ngOnDestroy() {
    if (this.addPostImageSub) {
      this.addPostImageSub.unsubscribe();
    }

    if (this.singlePostSub) {
      this.singlePostSub.unsubscribe();
    }

    if (this.deletePostSub) {
      this.deletePostSub.unsubscribe();
    }

    if (this.editPostSub) {
      this.editPostSub.unsubscribe();
    }

    if (this.removePostImageSub) {
      this.removePostImageSub.unsubscribe();
    }
  }

}
