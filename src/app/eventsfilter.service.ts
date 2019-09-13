import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsfilterService {
  private eventsfiltersource = new Subject<Map<String, any>>();

  eventsfilter = this.eventsfiltersource.asObservable();

  private filter: Map<String, any>;

  constructor() { }

  setFilterMap(filterMap: Map<String, any>) {
    this.filter = filterMap;
  }

  getFilterMap(): Map<String, any> {
    return this.filter
  }

  filterEvents(filterMap: Map<String, any>) {
    this.setFilterMap(filterMap);
    this.eventsfiltersource.next(filterMap);
  }
}
