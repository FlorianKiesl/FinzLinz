import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event';
import { MatTabChangeEvent } from '@angular/material';
import { Organizer } from './organizer';
import { OrganizerService } from './organizer.service';
import { Category } from './category';
import { CategoryService } from './category.service';
import { EventsfilterService } from './eventsfilter.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FinzInLinzApp';
  events: Event[];
  organizers: Organizer[];
  filter: Map<String, any>;
  categories: Category[];

  lines: String[] = ["Haoolll", "Haoolll", "Haoolll", "Haoolll", "Haoolll", "Haoolll"]

  constructor(
    private eventService: EventService, 
    private organizerService: OrganizerService, 
    private categoryService: CategoryService,
    private eventsfilterService: EventsfilterService,
    private route:Router) {
      // this.filter = new Map<String, any>();
      this.route.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.onFilterChanged(this.filter)
        }
      });
  }

  setEvents(): void {
    this.eventService.getEvents().subscribe(eventsParam => {
      this.events = eventsParam.sort( (a, b) => a.title.localeCompare(b.title) );
      this.onFilterChanged(
        new Map<String, any>().set(
            'filteredEvents', this.events
          ).set(
            'dateStart', undefined
          ).set(
            'dateEnd', undefined)
        );
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

  onFilterChanged(filterMap: Map<String, any>){
    this.eventsfilterService.filterEvents(filterMap);
    this.filter = filterMap;
  }

  onTabChange(event: MatTabChangeEvent){
    if (event.index == 1) {
      console.log(event);
    }
  }
}
