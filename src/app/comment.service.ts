import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJGbG9yaWFuIEtpZXNsIn0sImlhdCI6MTU3NjQyNzUxOCwiZXhwIjoxNTk2NDI3NTE4fQ.KnnsoCkBb-t7Rj9qudqitZNHgiu_bTEg88g39DAgj7c'
        })
      };

      return this.http.get<Comment[]>(this.httpURL + '/' + eventId.toString()).pipe(
       catchError(super.handleError('getComments', []))
     );
   }

   public addComment(comment:any): Observable<string> {

    const httpOptions = {
      headers: new HttpHeaders({
        responseType: 'text',
        'Content-Type':  'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJGbG9yaWFuIEtpZXNsIn0sImlhdCI6MTU3NjQyNzUxOCwiZXhwIjoxNTk2NDI3NTE4fQ.KnnsoCkBb-t7Rj9qudqitZNHgiu_bTEg88g39DAgj7c'
      })
    };

     return this.http.post<string>(this.httpURL, comment).pipe(
       catchError(super.handleError('addComment', 'Comment could not be added'))
     )
   }



}
