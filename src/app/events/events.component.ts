import { Component, OnInit } from '@angular/core';
import { Event } from '../event'
import { EventService } from '../event.service'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  sortItem: string = "Sortiert nach: ...";
  events: Event[];

  constructor(private eventService: EventService) { }

  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events
    });
  }

  ngOnInit() {
    this.getEvents();
  }

}
