import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventappointmentsComponent } from './eventappointments.component';

describe('EventappointmentsComponent', () => {
  let component: EventappointmentsComponent;
  let fixture: ComponentFixture<EventappointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventappointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventappointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
