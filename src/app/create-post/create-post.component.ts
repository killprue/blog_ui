import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DataManageService } from '../shared/data-manager.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { } from 'googlemaps';
import { ToastrService } from 'ngx-toastr';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  @ViewChild('location', { static: false }) location: ElementRef;
  map: google.maps.Map;
  faCalendarDay = faCalendarDay;
  curFile = "Choose file";

  fileToUpload: File;
  preventResubmit: boolean;
  postForm: FormGroup;

  createPostSub: Subscription;

  constructor(private dataManager: DataManageService, private router: Router,
    private fb: FormBuilder, private toast: ToastrService) { }

  ngOnInit() {
    const [month, day, year] = new Date().toLocaleDateString().split("/").map(x => parseInt(x));
    this.postForm = this.fb.group({
      photo: null,
      title: new FormControl('',
        [
          Validators.required, Validators.maxLength(500)
        ]
      ),
      content: new FormControl('', [
        Validators.required, Validators.maxLength(8000)
      ]),
      albumLink: new FormControl(''),
      datePicker: new FormControl({ year: year, month: month, day: day })
    });
  }

  public createNewPost() {
    this.preventResubmit = true;
    const filledPostForm = this.postForm.value;
    if (!filledPostForm.title || ["/", "&", ":", "\\", "-"].some(x => filledPostForm.title.indexOf(x) !== -1)) {
      this.toast.warning('* Title is required and cannot contain \\ / & : -', "Notice");
      this.preventResubmit = false;
    } else if (!this.location.nativeElement.value || ["/", "&", ":", "\\", "-"].some(x => this.location.nativeElement.value.indexOf(x) !== -1)) {
      this.toast.warning('* Location is required and cannot contain \\ / & : -', "Notice");
      this.preventResubmit = false;
    }
    else if (!filledPostForm.content) {
      this.toast.warning('* Content is required.', "Notice");
      this.preventResubmit = false;
    } else if (!this.fileToUpload) {
      this.toast.warning('* Main Photo is required.', "Notice");
      this.preventResubmit = false;
    } else if (!filledPostForm.datePicker) {
      this.toast.warning('* Date is required.', "Notice");
      this.preventResubmit = false;
    } else {
      this.preventResubmit = false;
      const fd = new FormData();
      fd.append('location', this.location.nativeElement.value);
      fd.append('file', this.fileToUpload, this.fileToUpload.name);
      fd.append('title', filledPostForm.title);
      fd.append('content', filledPostForm.content);
      fd.append('albumLink', filledPostForm.albumLink);
      fd.append('createDate', new Date(`${filledPostForm.datePicker.year}-${filledPostForm.datePicker.month}-${filledPostForm.datePicker.day}`).toISOString());

      this.createPostSub = this.dataManager.createBlogPost(fd).subscribe(
        res => {
          this.router.navigate(['/posts'])
        },
        err => {
          if (err.status === 400) {
            this.toast.warning('Title needs to be unique. Check to make sure this title has not been used already.', "Notice");
          } else {
            console.error(err)
          }
        }
      );
    }
  }

  public onFileSelect(event): void {
    this.fileToUpload = event.target.files[0] as File;
    this.postForm.value.Photo = this.fileToUpload;
    this.curFile = this.fileToUpload ? this.fileToUpload.name : "Choose File";
  }

  ngAfterViewInit() {
    this.initMap();
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
    if (this.createPostSub) {
      this.createPostSub.unsubscribe();
    }
  }
}
