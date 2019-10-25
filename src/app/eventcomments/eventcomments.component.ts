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

  constructor(private commenService:CommentService) {
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
        console.log(this.comments)
        this.calcRatingResults();
      },
      error => {
        this.comments = [];
        console.log(error);
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
        console.log(comment)
      },
      error => {
        console.log(error)
      }
    )
  }

  private sortComments() {
    this.comments.sort((c1, c2) => new Date(c2.published).getTime() - new Date(c1.published).getTime())
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

  getDateFormated(published:Date):string {
    return UtilsService.getDateFormated(published);
  }
}
