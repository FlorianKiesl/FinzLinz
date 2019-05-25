import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.scss']
})
export class EventdetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Event) { }

  ngOnInit() {
  }

}
