import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowTosComponent } from './how-tos.component';

describe('HowTosComponent', () => {
  let component: HowTosComponent;
  let fixture: ComponentFixture<HowTosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowTosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowTosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
