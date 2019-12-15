import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../comment';
import { UtilsService } from '../utils.service';
import { CommentService } from '../comment.service';
import { Event } from '../event';
import { EventService } from '../event.service';

@Component({
  selector: 'app-eventcomments',
  templateUrl: './eventcomments.component.html',
  styleUrls: ['./eventcomments.component.scss']
})
export class EventcommentsComponent implements OnInit {
  @Input() event: Event;
  @Output() eventChanged = new EventEmitter<Event>();

  private comments: Comment[];
  private showPersonalCommentForm:Boolean = false;

  constructor(private commenService:CommentService, private eventService:EventService) {
    this.comments = [];
  }

  ngOnInit() {
    this.getComments();
  }

  private getComments() {
    this.commenService.getComments(this.event.id).subscribe( 
      comments => {
        this.comments = comments;
        this.sortComments()
      },
      error => {
        this.comments = [];
      }
    )
  }

  private personalCommentFormBtnClicked(){
    this.showPersonalCommentForm = !this.showPersonalCommentForm;
    
  }

  private onNewComment(newComment: Comment) {
    newComment.event_id = this.event.id
    var json =  {
      'event_id': newComment.event_id,
      'user_id':  Math.floor((Math.random() * 100) + 1),
      'user_name': newComment.user_name,
      'rating': newComment.rating,
      'text': newComment.text
    }
    this.commenService.addComment(json).subscribe(
      comment => {
        this.getComments();
        this.eventService.getEvent(this.event.id).subscribe(
          eventItem => {
            this.event = eventItem;
            this.eventChanged.emit(eventItem)
          }
        );
      },
      error => {
        console.log(error)
      }
    )
    this.showPersonalCommentForm = false;
  }

  private sortComments() {
    this.comments.sort((c1, c2) => new Date(c2.published).getTime() - new Date(c1.published).getTime())
  }

  getRatingPerc(ratings): number {
    return this.event.ratingCount > 0 ? ratings / this.event.ratingCount : 0
  }

  getDateFormated(published:Date):string {
    return UtilsService.getDateFormated(published);
  }
}
