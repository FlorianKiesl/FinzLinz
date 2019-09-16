import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcommentsComponent } from './eventcomments.component';

describe('EventcommentsComponent', () => {
  let component: EventcommentsComponent;
  let fixture: ComponentFixture<EventcommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventcommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventcommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
