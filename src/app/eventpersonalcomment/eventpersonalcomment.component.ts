import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventpersonalcomment',
  templateUrl: './eventpersonalcomment.component.html',
  styleUrls: ['./eventpersonalcomment.component.scss']
})
export class EventpersonalcommentComponent implements OnInit {
  private rating:number = -1;

  constructor() { }

  ngOnInit() {
  }

  setRating(star:number){
    this.rating = star == this.rating ? -1 : star;
    console.log(this.rating)
  }
}
