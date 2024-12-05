import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Role } from "../interfaces/role";
import { Injectable, signal } from "@angular/core";
import { RoleCreateRequest } from "../interfaces/role-create-request";
import { Menu, Menus } from "../interfaces/menu";
import { MenuPermission } from "../interfaces/menu-permission";

@Injectable({
    providedIn: 'root'
  })
  export class RoleService {
  
    baseUrl : string = environment.apiUrl;
  
    constructor(private http: HttpClient) { }

    _menulist = signal<Menu[]>([]);
  
    getRoles = () : Observable<Role[]> => 
        this.http.get<Role[]>(`${this.baseUrl}/Roles`);

    createRole = (role:RoleCreateRequest) : Observable<{ message: string }> => 
      this.http.post<{ message: string }>(`${this.baseUrl}/Roles`, role);

    deleteRole = (id: string) : Observable<{ message: string }> => 
      this.http.delete<{ message: string }>(`${this.baseUrl}/Roles/role/${id}`);

    assignRole = (userId: string, roleId: string) : Observable<{ message: string }> => 
      this.http.post<{ message: string }>(`${this.baseUrl}/Roles/assign`, {userId, roleId});

    Loadmenubyrole(role: string) {
      return this.http.get<Menu[]>(this.baseUrl + '/Roles/GetAllMenusbyrole?userrole=' + role);
    }

    getMenuPermission(role:string,menuname:string){
      return this.http.get<MenuPermission>(this.baseUrl + '/Roles/GetMenupermissionbyrole?userrole='+role+'&menucode=' + menuname);
    }
    
    Getallmenus() {
      return this.http.get<Menus[]>(this.baseUrl + '/Roles/GetAllMenus');
    }

    assignRolePermission(_data:MenuPermission[]){
      return this.http.post(this.baseUrl + '/Roles/assignrolepermission', _data);
    }
}