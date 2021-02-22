import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHowToComponent } from './create-how-to.component';

describe('CreateHowToComponent', () => {
  let component: CreateHowToComponent;
  let fixture: ComponentFixture<CreateHowToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHowToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHowToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
