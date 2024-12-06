import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl : string = environment.apiUrl;
  
    constructor(private http: HttpClient) { }

    getAllCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.baseUrl}/Categories`);
    }

    getCategoryById(id: number): Observable<Category> {
      return this.http.get<Category>(`${this.baseUrl}/Categories/${id}`);
    }
  
    addCategory(category: Category): Observable<Category> {
      return this.http.post<Category>(`${this.baseUrl}/Categories`, category);
    }
  
    updateCategory(category: Category): Observable<void> {
      return this.http.put<void>(`${this.baseUrl}/Categories/${category.id}`, category);
    }
  
    deleteCategory(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/Categories/${id}`);
    }
}
