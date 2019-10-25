import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './comment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseService {

  constructor(protected http:HttpClient) {
    super(http, 'comments');
    // this.comments.push(new Comment(1, "Test User", 1, new Date(), 4, "Super."));
    // this.comments.push(new Comment(2, "Test User 2", 1, new Date(), 3, "Super."));
   }

   public getComments(eventId:Number): Observable<Comment[]> {
     return this.http.get<Comment[]>(this.httpURL + '/' + eventId.toString()).pipe(
       catchError(super.handleError('getComments', []))
     );
    //  return new Observable<Comment[]>((observer) => {
    //    observer.next(this.comments);
    //    observer.complete();
    //    return {unsubscribe() {}}
    //  })
   }

   public addComment(comment:any): Observable<string> {
     return this.http.post(this.httpURL, comment, {responseType: 'text'}).pipe(
       catchError(super.handleError('addComment', 'Comment could not be added'))
     )
   }



}
