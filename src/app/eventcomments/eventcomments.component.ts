import { Component, OnInit } from '@angular/core';
import { Comment } from '../comment';
import { UtilsService } from '../utils.service';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-eventcomments',
  templateUrl: './eventcomments.component.html',
  styleUrls: ['./eventcomments.component.scss']
})
export class EventcommentsComponent implements OnInit {
  private comments: Comment[];
  private showPersonalCommentForm:Boolean = false;

  constructor(private commenService:CommentService, public utils:UtilsService) {

  }

  ngOnInit() {
    this.setComments();
  }

  private setComments() {
    this.commenService.getComments(1).subscribe( comments => {
      this.comments = comments;
    })
  }

  private personalCommentFormBtnClicked(){
    this.showPersonalCommentForm = !this.showPersonalCommentForm;
    
  }

  private onNewComment(newComment: Comment) {
    this.comments.push(newComment);
  }

}
