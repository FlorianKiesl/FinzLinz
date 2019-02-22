import { Injectable } from '@angular/core';
import { Event } from './event';
import { BaseService} from './base.service';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {

  constructor (protected http: HttpClient) {
    super(http, 'events');
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.httpURL).pipe(
      catchError(super.handleError('getEvents', []))
    );
  }
}
