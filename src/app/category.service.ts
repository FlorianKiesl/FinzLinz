import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category, CategoryAdapter } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  constructor(protected http:HttpClient, private adapter:CategoryAdapter) {
    super(http, 'categories');
   }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.httpURL).pipe(
      map((data : any[]) => data.map(item => this.adapter.adapt(item))),
      catchError(super.handleError('getCategories', []))
    );
  }
}
