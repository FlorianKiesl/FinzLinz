import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';
import { EventOccurence } from '../eventOccurence';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatListOptionBase, MatListOption } from '@angular/material';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-eventappointments',
  templateUrl: './eventappointments.component.html',
  styleUrls: ['./eventappointments.component.scss']
})
export class EventappointmentsComponent implements OnInit {
  @Input() event: Event;

  private dates:EventOccurence[];
  private matListFormControl = new FormControl();
  private selectedOptions:number[] = [];
  private count = 5;

  constructor(private utilservice:UtilsService) { }

  ngOnInit() {
    this.dates = this.event.getAvailableEventOccurences();
  }


  private selectionListChanged(value:any){

  }

  export() {
    var event_dates = []
    for (let selection of this.selectedOptions) {
      event_dates.push(this.dates[selection])
    }
    this.utilservice.createEventICSFile(this.event, event_dates)
  }
}
