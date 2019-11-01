import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';
import { EventOccurence } from '../eventOccurence';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatListOptionBase, MatListOption } from '@angular/material';

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

  constructor() { }

  ngOnInit() {
    this.dates = this.event.getAvailableEventOccurences();
    console.log(this.selectedOptions)
  }


  private selectionListChanged(value:any){
    console.log(value);
    console.log(this.selectedOptions)
  }
}
