import { TestBed } from '@angular/core/testing';

import { EventsfilterService } from './eventsfilter.service';

describe('EventsfilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventsfilterService = TestBed.get(EventsfilterService);
    expect(service).toBeTruthy();
  });
});
