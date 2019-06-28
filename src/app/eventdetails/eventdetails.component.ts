import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.scss']
})
export class EventdetailsComponent implements OnInit {

  rating:number = -1;

  constructor(
    public dialogRef: MatDialogRef<EventdetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Event) { }

  ngOnInit() {
  }

  onHomeClick(): void {
    this.dialogRef.close();
  }

  setRating(star:number){
    this.rating = star == this.rating ? -1 : star;
    console.log(this.rating)
  }
}
