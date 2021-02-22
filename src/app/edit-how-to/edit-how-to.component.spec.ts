import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHowToComponent } from './edit-how-to.component';

describe('EditHowToComponent', () => {
  let component: EditHowToComponent;
  let fixture: ComponentFixture<EditHowToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHowToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHowToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
