import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Organizer } from './organizer';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService extends BaseService {
  
  constructor(protected http: HttpClient) {
    super(http, 'organizers');
  }

  getOrganizers(): Observable<Organizer[]> {
    return this.http.get<Organizer[]>(this.httpURL).pipe(
      catchError(this.handleError('getOrganizers', []))
    );
  }
}
