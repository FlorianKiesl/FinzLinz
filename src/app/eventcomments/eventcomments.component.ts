import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../comment';
import { UtilsService } from '../utils.service';
import { CommentService } from '../comment.service';
import { Event } from '../event';

@Component({
  selector: 'app-eventcomments',
  templateUrl: './eventcomments.component.html',
  styleUrls: ['./eventcomments.component.scss']
})
export class EventcommentsComponent implements OnInit {
  @Input() event: Event;

  private comments: Comment[];
  private showPersonalCommentForm:Boolean = false;

  private avgRating:number = -1;
  private sumRatings:number = 0;

  private sumRating5:number = 0;
  private percRating5:number = 0;

  private sumRating4:number = 0;
  private percRating4:number = 0;

  private sumRating3:number = 0;
  private percRating3:number = 0;

  private sumRating2:number = 0;
  private percRating2:number = 0;

  private sumRating1:number = 0;
  private percRating1:number = 0;

  constructor(private commenService:CommentService, public utils:UtilsService) {

  }

  ngOnInit() {
    this.getComments();
    this.calcRatingResults();
  }

  private getComments() {
    this.commenService.getComments(this.event.id).subscribe( comments => {
      this.comments = comments;
    })
  }

  private personalCommentFormBtnClicked(){
    this.showPersonalCommentForm = !this.showPersonalCommentForm;
    
  }

  private onNewComment(newComment: Comment) {
    this.comments.push(newComment);
    this.calcRatingResults();
    this.event.rating = (this.sumRating1*1 + this.sumRating2*2 + this.sumRating3*3 + this.sumRating4*4 + this.sumRating5*5) / this.sumRatings;

  }

  private calcRatingResults() {
    this.sumRating1 = 0;
    this.sumRating2 = 0;
    this.sumRating3 = 0;
    this.sumRating4 = 0;
    this.sumRating5 = 0;

    this.comments.forEach( (commentItem) => {
      if (commentItem.rating == 5) {
        ++this.sumRating5;
      }
      else if (commentItem.rating == 4) {
        ++this.sumRating4;
      }
      else if (commentItem.rating == 3) {
        ++this.sumRating3;
      }
      else if (commentItem.rating == 2) {
        ++this.sumRating2;
      }
      else if (commentItem.rating == 1) {
        ++this.sumRating1;
      }
    });

    this.sumRatings = this.sumRating1 + this.sumRating2 + this.sumRating3 + this.sumRating4 + this.sumRating5;
    this.percRating5 = this.sumRating5 / this.sumRatings;
    this.percRating4 = this.sumRating4 / this.sumRatings;
    this.percRating3 = this.sumRating3 / this.sumRatings;
    this.percRating2 = this.sumRating2 / this.sumRatings;
    this.percRating1 = this.sumRating1 / this.sumRatings;
  }
}
