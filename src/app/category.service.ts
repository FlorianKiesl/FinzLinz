import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  constructor(protected http:HttpClient) {
    super(http, 'categories');
   }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.httpURL).pipe(
      catchError(super.handleError('getCategories', []))
    );
  }
}
