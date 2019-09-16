import { Component, OnInit } from '@angular/core';
import { Comment } from '../comment';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-eventcomments',
  templateUrl: './eventcomments.component.html',
  styleUrls: ['./eventcomments.component.scss']
})
export class EventcommentsComponent implements OnInit {

  private comments: Comment[] = [];

  constructor(public utils:UtilsService) {
    this.comments.push(new Comment(1, "Test User", 1, new Date(), 4, "Super."));
    this.comments.push(new Comment(2, "Test User 2", 1, new Date(), 3, "Super."));
   }

  ngOnInit() {
  }



}
