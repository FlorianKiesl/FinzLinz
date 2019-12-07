import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Event } from '../event';
import { Organizer } from '../organizer';
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
  @Input() organizers: Organizer[];

  filter: Map<String, any>;
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
      this.organizers.find(function(item){return item.id == event.organizer.id}) 
      : undefined)
  }

  ngOnInit() {
    this.filter = this.eventsfilterService.getFilterMap();
    this.events = this.filter ? this.filter.get("filteredEvents"): undefined;
    this.onSortByNextEventClick();
    
    this.subscription = this.eventsfilterService.eventsfilter.subscribe( filterMap => {
        this.filter = filterMap;
        this.events = this.filter.get('filteredEvents');
        this.onSortByNextEventClick();
      }
    );

    
    this.setOrganizers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setOrganizers(): void {
    this.organizerService.getOrganizers().subscribe(organizors => {
      this.organizers = organizors.sort( (a, b) => a.name.localeCompare(b.name) );
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
  }

  onSortByNameClick() {
    this.events.sort((e1, e2) => e1.title.localeCompare(e2.title))
    this.sortedItem = 1;
  }

  onSortByNextEventClick() {
    if (this.events){
      console.log(this.filter)
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
    }
    this.sortedItem = 2;
  }

  onSortByOrganizerClick() {
    this.events.sort((e1, e2) => e1.organizer["#text"].localeCompare(e2.organizer["#text"]))
    this.sortedItem = 3;
  }

  onSortByNearestEventClick() {
    this.sortedItem = 4;
  }

  onSortByCategorieClick() {
    this.sortedItem = 5;
  }

  onShareClick() {
  }

  getNextEventDateString(event: Event): String {
    return event.getNextEventDateBetweenString(this.filter.get('dateStart'), this.filter.get('dateEnd'));
  }

  createEventICSFile(event:Event){
    let event_date = event.getNextEventDateBetween(this.filter.get('dateStart'), this.filter.get('dateEnd'));
    this.utils.createEventICSFile(event, [event_date])
  }

  openEventDetails(event:Event) {
    this.utils.openEventDetails(event).subscribe(eventItem => {
      this.events[this.events.findIndex(el => el._id === eventItem._id)] = eventItem;
    })
  }
}
