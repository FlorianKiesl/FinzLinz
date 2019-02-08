import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';
import { Organizer } from '../organizer';
import { OrganizerService } from '../organizer.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  @Input() events: Event[] 
  @Input() organizers: Organizer[];

  sortItem: string = "Sortiert nach: ...";

  constructor() { }

  getOrganizer(id:number): Organizer {
    return (this.organizers ? 
      this.organizers.find(function(item){return item["id"] == id}) 
      : undefined)
  }

  ngOnInit() {
  }

}
