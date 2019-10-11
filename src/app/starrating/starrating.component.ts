import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';

@Component({
  selector: 'app-starrating',
  templateUrl: './starrating.component.html',
  styleUrls: ['./starrating.component.scss']
})
export class StarratingComponent implements OnInit {
  @Input() rating:any;
  
  public maxRating:number;

  constructor() {
    this.maxRating = 5
   }

  ngOnInit() {
  }


public getIntegerStars():number {
  return Math.trunc(this.rating);
}

public getRemainder():number {
    return this.getIntegerStars() > 0 ? this.rating % this.getIntegerStars() : this.rating;
}

}
