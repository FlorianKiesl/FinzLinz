import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Location } from './location';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends BaseService{

  constructor(protected http: HttpClient) { 
    super(http, 'places');
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.httpURL).pipe(
      catchError(this.handleError('getLocations', []))
    );
  }

  getLocation(id:number): Observable<Location> {
    return this.http.get<Location>(this.httpURL + '/' + id).pipe(
      catchError(this.handleError('getLocation', undefined))
    )
  }
}
