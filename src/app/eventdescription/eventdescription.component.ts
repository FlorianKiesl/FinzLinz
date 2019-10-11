import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';

@Component({
  selector: 'app-eventdescription',
  templateUrl: './eventdescription.component.html',
  styleUrls: ['./eventdescription.component.scss']
})
export class EventdescriptionComponent implements OnInit {
  @Input() event:Event;

  constructor() { }

  ngOnInit() {

  }

}
