import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsfilterComponent } from './eventsfilter.component';

describe('EventsfilterComponent', () => {
  let component: EventsfilterComponent;
  let fixture: ComponentFixture<EventsfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
