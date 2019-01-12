import { Component, OnInit } from '@angular/core';
import { Event } from '../event';
import { Organizer } from '../organizer';
import { EventService } from '../event.service';
import { OrganizerService } from '../organizer.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  sortItem: string = "Sortiert nach: ...";
  events: Event[];
  organizers: Organizer[];

  constructor(private eventService: EventService, private organizerService: OrganizerService) { }

  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  getOrganizers(): void {
    this.organizerService.getOrganizers().subscribe(organizors => {
      this.organizers = organizors;
    });
  }

  getOrganizer(id:number): Organizer {
    if (this.organizers) {
      for (let item of this.organizers) {
        if (item["id"] == id) {
          return item;
        }
      }
    }
    return new Organizer(); 
  }

  ngOnInit() {
    this.getEvents();
    this.getOrganizers();
  }

}
