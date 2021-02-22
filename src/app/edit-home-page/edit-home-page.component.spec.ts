import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomePageComponent } from './edit-home-page.component';

describe('EditHomePageComponent', () => {
  let component: EditHomePageComponent;
  let fixture: ComponentFixture<EditHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
