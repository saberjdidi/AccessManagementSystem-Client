import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl : string = environment.apiUrl;
  
    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.baseUrl}/Products`);
    }

    getProductById(id: number): Observable<Product> {
      return this.http.get<Product>(`${this.baseUrl}/Products/${id}`);
    }
  
    addProduct(product: FormData): Observable<Product> {
      console.log('product : ' + product);
      return this.http.post<Product>(`${this.baseUrl}/Products`, product);
    }
  
    updateProduct(product: FormData, id: number): Observable<void> {
      return this.http.put<void>(`${this.baseUrl}/Products/${id}`, product);
    }
  
    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/Products/${id}`);
    }
}
