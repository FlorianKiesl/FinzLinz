import { Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';

export class BaseService {
  private readonly baseURL = 'http://nobodynhio.com:3000/api';
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
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
        
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
      
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
}