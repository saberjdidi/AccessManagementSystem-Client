import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from '../interfaces/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  baseUrl : string = environment.apiUrl;

  getAll() : Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl + '/Customer/GetAll');
  }

  getByCode(code:string) : Observable<Customer> {
    return this.http.get<Customer>(this.baseUrl + '/Customer/Getbycode?code='+code);
  }

  createCustomer(_data: Customer) {
    return this.http.post(this.baseUrl + '/Customer/create', _data);
  }

  updateCustomer(_data: Customer) {
    return this.http.put(this.baseUrl + '/Customer/Update?code=' + _data.code, _data);
  }

  deleteCustomer(code: string) {
    return this.http.delete(this.baseUrl + '/Customer/Remove?code=' + code);
  }
}
