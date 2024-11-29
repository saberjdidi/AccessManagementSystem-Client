import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Role } from "../interfaces/role";
import { Injectable } from "@angular/core";
import { RoleCreateRequest } from "../interfaces/role-create-request";

@Injectable({
    providedIn: 'root'
  })
  export class RoleService {
  
    baseUrl : string = environment.apiUrl;
  
    constructor(private http: HttpClient) { }
  
    getRoles = () : Observable<Role[]> => 
        this.http.get<Role[]>(`${this.baseUrl}/Roles`);

    createRole = (role:RoleCreateRequest) : Observable<{ message: string }> => 
      this.http.post<{ message: string }>(`${this.baseUrl}/Roles`, role);

    deleteRole = (id: string) : Observable<{ message: string }> => 
      this.http.delete<{ message: string }>(`${this.baseUrl}/Roles/role/${id}`);

    assignRole = (userId: string, roleId: string) : Observable<{ message: string }> => 
      this.http.post<{ message: string }>(`${this.baseUrl}/Roles/assign`, {userId, roleId});
}