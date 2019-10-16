import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';

@Component({
  selector: 'app-eventappointments',
  templateUrl: './eventappointments.component.html',
  styleUrls: ['./eventappointments.component.scss']
})
export class EventappointmentsComponent implements OnInit {
  @Input() event: Event;

  constructor() { }

  ngOnInit() {
  }

}
