import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.scss']
})
export class EventdetailsComponent implements OnInit {

  event: Event;

  constructor(
    public dialogRef: MatDialogRef<EventdetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Event) {
      this.event = data;
    }

  ngOnInit() {
    
  }

  onHomeClick(): void {
    this.dialogRef.close();
  }

  close(): void{
    this.dialogRef.close();
  }
}
