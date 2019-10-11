import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdescriptionComponent } from './eventdescription.component';

describe('EventdescriptionComponent', () => {
  let component: EventdescriptionComponent;
  let fixture: ComponentFixture<EventdescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventdescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventdescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
