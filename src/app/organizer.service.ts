import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Organizer } from './organizer';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {
  private httpURL = "http://nobodynhio.com:3000/api/organizers"

  constructor(private http: HttpClient) { }

  getOrganizers(): Observable<Organizer[]> {
    return this.http.get<Organizer[]>(this.httpURL).pipe(
      catchError(this.handleError('getOrganizers', []))
    );
  }

        /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.log('Error');
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
        
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
     
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

}
