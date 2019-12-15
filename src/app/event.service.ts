import { Injectable } from '@angular/core';
import { Event, EventAdapter } from './event';
import { BaseService} from './base.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {

  constructor (protected http: HttpClient, private adapter: EventAdapter) {
    super(http, 'events');
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.httpURL).pipe(
      map((data : any[]) => data.map(item => this.adapter.adapt(item))),
      catchError(super.handleError('getEvents', []))
    );
  }

  getEvent(id:number):Observable<Event> {
    return this.http.get<Event>(this.httpURL + '/' + id).pipe(
      map(data => this.adapter.adapt(data[0]))
    )
  }
}
