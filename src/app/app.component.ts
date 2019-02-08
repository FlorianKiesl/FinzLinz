import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from './event';
import { text } from '@angular/core/src/render3';
import { MatTabChangeEvent } from '@angular/material';
import { Organizer } from './organizer';
import { OrganizerService } from './organizer.service';

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
  constructor(private eventService: EventService, private organizerService: OrganizerService) {
  }

  setEvents(): void {
    this.eventService.getEvents().subscribe(eventsParam => {
      this.filteredEvents = eventsParam.filter(
        event => 1 === 1
      );
      this.events = eventsParam.sort( (a, b) => a.title.localeCompare(b.title) );
    });
  }

  setOrganizers(): void {
    this.organizerService.getOrganizers().subscribe(organizors => {
      this.organizers = organizors.sort( (a, b) => a.name.localeCompare(b.name) );
    });
  }

  ngOnInit(){
    this.setEvents();
    this.setOrganizers();
  }

  onFilterChanged(filter: Map<String, any>){
    console.log(filter.get('organizer'));
    let itemOrganizer = this.organizers.filter(
      organizer => organizer.name.search(filter.get('organizer')) == 0
    )
    console.log(itemOrganizer);
    console.log(itemOrganizer.findIndex( organizer => organizer.id == 60990 ));
    this.filteredEvents = this.events.filter(
      event => itemOrganizer.findIndex( organizer => organizer.id == event.organizer.id) >= 0
    );
  }

  onTabChange(event: MatTabChangeEvent){
    if (event.index == 1) {
      console.log(event);
    }
  }
}
