import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event';
import { MatTabChangeEvent } from '@angular/material';
import { Organizer } from './organizer';
import { OrganizerService } from './organizer.service';
import { Category } from './category';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FinzInLinzApp';
  events: Event[];
  organizers: Organizer[];
  filteredEvents: Event[];
  categories: Category[];

  constructor(
    private eventService: EventService, 
    private organizerService: OrganizerService, 
    private categoryService: CategoryService) {
  }

  setEvents(): void {
    this.eventService.getEvents().subscribe(eventsParam => {
      this.events = eventsParam.sort( (a, b) => a.title.localeCompare(b.title) );
      this.filteredEvents = this.events;
    });
  }

  setOrganizers(): void {
    this.organizerService.getOrganizers().subscribe(organizors => {
      this.organizers = organizors.sort( (a, b) => a.name.localeCompare(b.name) );
    });
  }

  setCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories.sort( (a, b) => a.name.localeCompare(b.name) );
    });
  }

  ngOnInit(){
    this.setEvents();
    this.setOrganizers();
    this.setCategories();
  }

  onFilterChanged(filter: Map<String, any>){
    
    if (this.events && this.organizers) {

      let filteredOrganizers = filter.get('organizer') ? this.organizers.filter(
        organizer => organizer.name.search(filter.get('organizer')) >= 0
      ) : this.organizers;
      
      let filteredEvents =  this.events.filter(
        event =>  (
          (filter.get('title') ? event.title.search(filter.get('title')) >= 0 : true) &&
          (filter.get('startDate') ? 
            new Date(event.firstdate).valueOf() >= filter.get('startDate').valueOf() || 
            new Date(event.lastdate).valueOf() >= filter.get('startDate').valueOf() 
            : true
          ) &&
          (filter.get('endDate') ? 
            new Date(event.firstdate).valueOf() <= filter.get('endDate').valueOf() ||
            new Date(event.lastdate).valueOf() <= filter.get('endDate').valueOf()
            : true          
          ) &&
          (
            filter.get('categories') ? 
              filter.get('categories').findIndex(category => 
                Array.isArray(event.categories.category) ? 
                event.categories.category.findIndex(item => item.id == category.id) >= 0 :
                event.categories.category.id == category.id) >= 0
              : true
          )
        )
      );
  
      this.filteredEvents = filteredEvents.filter(
        event => filteredOrganizers.findIndex( organizer => organizer.id == event.organizer.id) >= 0
      );
    } 
  }

  onTabChange(event: MatTabChangeEvent){
    if (event.index == 1) {
      console.log(event);
    }
  }
}
