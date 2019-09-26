import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { Comment } from '../comment';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-eventpersonalcomment',
  templateUrl: './eventpersonalcomment.component.html',
  styleUrls: ['./eventpersonalcomment.component.scss']
})
export class EventpersonalcommentComponent implements OnInit {
  @Output() newComment = new EventEmitter<Comment>();

  private rating:number = -1;
  userName:String = '';
  text:String = '';

  constructor() { }

  ngOnInit() {
  }

  setRating(star:number){
    this.rating = star == this.rating ? -1 : star;
    console.log(this.rating)
  }

  private addPersonalComment() {
    let emitNewComment = true;

    if (!this.userName) {
      console.log("UserName missing")
      emitNewComment = false;
    }

    if (!this.text) {
      console.log("Text missing");
      emitNewComment = false;
    }

    if (this.rating < 1) {
      console.log("Rating missing");
      emitNewComment = false;
    }

    if (emitNewComment) this.newComment.emit(new Comment(-1, this.userName, -1, new Date(), this.rating, this.text));
  }
}
