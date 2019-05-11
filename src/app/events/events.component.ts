import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Event } from '../event';
import { Organizer } from '../organizer';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnChanges {
  @Input() events: Event[] 
  @Input() organizers: Organizer[];

  sortItem: string = "Sortiert nach";
  sortedItem = 2;

  constructor() { }

  getOrganizer(event:Event): Organizer {
    return (this.organizers && event.organizer ? 
      this.organizers.find(function(item){return item["id"] == event.organizer.id}) 
      : undefined)
  }

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError, { maximumAge: 1500000, timeout: 0 })
  }

  // displayLocationInfo(position) {
  //   const lng = position.coords.longitude;
  //   const lat = position.coords.latitude;
  
  //   console.log(`longitude: ${lng} | latitude: ${lat}`);
  // }

  // handleLocationError(error) {
  //   console.log(error.code);
  //   switch (error.code) {
      
  //     case 3:
  //       // timeout was hit, meaning nothing's in the cache
  //       // let's provide a default location:
  //       this.displayLocationInfo({ coords: { longitude: 33.631839, latitude: 27.380583 } });
  
  //       // now let's make a non-cached request to get the actual position
  //       navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError);
  //       break;
  //     case 2:
  //       // ...
  //       break;
  //     case 1:
  //     // ...
  //   }
  // }

  getDateFormatString(date: Date): String {
    var today = new Date();
    return (new Date(date)).setHours(0,0,0,0) == today.setHours(0, 0, 0, 0) ? "Heute" : 
    (new Date(date)).setHours(0,0,0,0) == new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0, 0) ? "Morgen" : 
    undefined;
  }

  isToday(date: Date): Boolean {
    var today = new Date();
    return (new Date(date)).setHours(0,0,0,0) == today.setHours(0, 0, 0, 0)
  }

  isTomorrow(date: Date): Boolean {
    var today = new Date();
    return (new Date(date)).setHours(0,0,0,0) == new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0, 0)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes["events"]) {
      this.onSortByNextEventClick();
    }
  }

  onSortByNameClick() {
    this.events.sort((e1, e2) => e1.title.localeCompare(e2.title))
    this.sortedItem = 1;
  }

  onSortByNextEventClick() {
    this.events.sort(
      (e1, e2) => 
      e1.getNextEventDate() && e2.getNextEventDate() ? e1.getNextEventDate().dFrom.valueOf() - e2.getNextEventDate().dFrom.valueOf() : e1.getNextEventDate() ? 1 : -1)
    this.sortedItem = 2;
  }

  onSortByOrganizerClick() {
    this.events.sort((e1, e2) => e1.organizer["#text"].localeCompare(e2.organizer["#text"]))
    this.sortedItem = 3;
  }

  onSortByNearestEventClick() {
    //this.events.sort((e1, e2) => e1.title.localeCompare(e2.title))
    this.sortedItem = 4;
  }

  onSortByCategorieClick() {
    //this.events.sort((e1, e2) => e1.category.localeCompare(e2.organizer["#text"]))
    this.sortedItem = 5;
  }

  onShareClick() {
  }
}
