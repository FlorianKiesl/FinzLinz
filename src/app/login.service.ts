import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http, 'oauth/google');
  }

  
  login(): Observable<any> {
    console.log(this.httpURL)
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*',
      })
    };

    return this.http.get<any>(this.httpURL).pipe(
      catchError(this.handleError('login', []))
    );
  }
  
}
