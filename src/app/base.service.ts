import { Observable, of, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';

export class BaseService {
  private readonly baseURL = 'https://nobodynhio.com:443/api'; /*'http://localhost:3000/api' /*'https://nobodynhio.com:443/api';*/
  protected httpURL: string;

  constructor(protected http: HttpClient, protected api: string) {
    this.httpURL = this.baseURL + '/' + api;
  }
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.log('Error');
        console.log('#######')
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
        
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
      
        // Let the app keep running by returning an empty result.
        return throwError(error);
      };
    }
}