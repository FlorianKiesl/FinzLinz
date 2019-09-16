import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Event } from '../event';
import { Organizer } from '../organizer';
import {MatDialog} from '@angular/material';
import { EventdetailsComponent } from '../eventdetails/eventdetails.component';
import { EventOccurence } from '../eventOccurence';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { OrganizerService } from '../organizer.service';
import { EventsfilterService } from '../eventsfilter.service';
import { Subscription } from 'rxjs';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filter: Map<String, any>;
  @Input() organizers: Organizer[];

  sortItem: string = "Sortiert nach";
  sortedItem = 2;
  events: Event[] = [];
  subscription: Subscription;

  constructor(
    private organizerService:OrganizerService, 
    private eventsfilterService: EventsfilterService, 
    public utils:UtilsService) {
    
   }

  getOrganizer(event:Event): Organizer {
    return (this.organizers && event.organizer ? 
      this.organizers.find(function(item){return item["id"] == event.organizer.id}) 
      : undefined)
  }

  ngOnInit() {
    this.filter = this.eventsfilterService.getFilterMap();

    this.subscription = this.eventsfilterService.eventsfilter.subscribe( filterMap => {
      this.filter = filterMap;
      this.events = this.filter.get('filteredEvents');
      }
    );

    this.events = this.filter.get("filteredEvents");
    this.setOrganizers();
    // navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError, { maximumAge: 1500000, timeout: 0 })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setOrganizers(): void {
    this.organizerService.getOrganizers().subscribe(organizors => {
      this.organizers = organizors.sort( (a, b) => a.name.localeCompare(b.name) );
    });
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
    console.log(changes);
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
    let event_date = event.getNextEventDateBetween(this.filter.get('dateStart'), this.filter.get('dateEnd'));
    this.utils.createEventICSFile(event, event_date)
  }
}
