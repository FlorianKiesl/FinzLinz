import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventpersonalcommentComponent } from './eventpersonalcomment.component';

describe('EventpersonalcommentComponent', () => {
  let component: EventpersonalcommentComponent;
  let fixture: ComponentFixture<EventpersonalcommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventpersonalcommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventpersonalcommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
