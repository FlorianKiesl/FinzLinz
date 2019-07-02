import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Event } from '../event';
import { Organizer } from '../organizer';
import {MatDialog} from '@angular/material';
import { EventdetailsComponent } from '../eventdetails/eventdetails.component';
import { EventOccurence } from '../eventOccurence';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnChanges {
  @Input() filter: Map<String, any>;
  @Input() organizers: Organizer[];

  sortItem: string = "Sortiert nach";
  sortedItem = 2;
  events: Event[] = [];

  constructor(public eventDetailsDialog:MatDialog) {
    
   }

  getOrganizer(event:Event): Organizer {
    return (this.organizers && event.organizer ? 
      this.organizers.find(function(item){return item["id"] == event.organizer.id}) 
      : undefined)
  }

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError, { maximumAge: 1500000, timeout: 0 })
  }

  openEventDetails(event:Event){
    const eventDetailDialogRef = this.eventDetailsDialog.open(
      EventdetailsComponent, {data: event}
    );
    eventDetailDialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed: ${result}");
    })
    console.log(event);
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
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes["filter"]) {
      this.events = this.filter.get("filteredEvents");
      if (this.events) {
        this.onSortByNextEventClick();
      }
    }
  }

  onSortByNameClick() {
    this.events.sort((e1, e2) => e1.title.localeCompare(e2.title))
    this.sortedItem = 1;
  }

  onSortByNextEventClick() {
    this.events.sort(
      function(e1, e2)  {
        let e1Date = e1.getNextEventDateBetween(this.filter.get('dateStart'), this.filter.get('dateEnd'));
        let e2Date = e2.getNextEventDateBetween(this.filter.get('dateStart'), this.filter.get('dateEnd'));

        if (e1Date && e2Date) {
          return e1Date.dFrom.valueOf() - e2Date.dFrom.valueOf();
        }
        else if (e1Date && !e2Date) {
          return 1
        }
        else {
          return -1
        }
      }.bind(this)
    )
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

  getNextEventDateString(event: Event): String {
    return event.getNextEventDateBetweenString(this.filter.get('dateStart'), this.filter.get('dateEnd'));
  }

  createEventICSFile(event:Event){
    console.log('HALLLLLOOOOO')
    var content = 
      'BEGIN:VCALENDAR'+ '\n' +
      'PRODID:Calendar'+ '\n' +
      'VERSION:2.0'+ '\n' +
      'BEGIN:VEVENT'+ '\n' +
      'UID:0@default'+ '\n' +
      'CLASS:PUBLIC'+ '\n' +
      'DESCRIPTION:' + event.title + '\n' +
      //DTSTAMP;VALUE=DATE-TIME:20190527T195353
      'DTSTART;VALUE=DATE-TIME:'+ formatDate(event.getNextEventDate().dFrom, 'yyyyMMddThhmmss', 'en') + '\n' +
      'DTEND;VALUE=DATE-TIME:'+ formatDate(event.getNextEventDate().dTo, 'yyyyMMddThhmmss', 'en') + '\n' +
      //how to get organizername? 
      'LOCATION:' + event.organizer +  '\n' +
      'TRANSP:TRANSPARENT' + '\n' +
      'END:VEVENT' + '\n' +
      'END:VCALENDAR'
    var filename = 'export.ics'

    var blob = new Blob([content], {
     type: "text/plain;charset=utf-8"
    });
    
    saveAs(blob, filename);
  }
}
