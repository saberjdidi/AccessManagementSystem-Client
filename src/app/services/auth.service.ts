import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl : string = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  loginService(data: LoginRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Account/login`, data)
    .pipe(
      map((response) => {
        if(response.isSuccess){
          localStorage.setItem(this.tokenKey, response.token);
        }
        return response;
      })
     );
  }

  registerService(data: RegisterRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Account/register`, data);
  }

  forgotPasswordService(email: string) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Account/forgot-password`, {email});
  }

  resetPasswordService(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Account/reset-password`, data);
  }

  getDetail = () : Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.baseUrl}/Account/detail`);

  getAllUsers = () : Observable<UserDetail[]> => 
    this.http.get<UserDetail[]>(`${this.baseUrl}/Account`);
  

  getUserDetail = ()=> {
    const token = this.getToken();
    if(!token) return null;
    const decodedToken:any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || []
    };

    return userDetail;
  }

  public getToken = (): string | null => localStorage.getItem(this.tokenKey) || '';

  isLoggedIn = ():boolean => {
    const token = this.getToken();
    if(!token) return false;

    return !this.isTokenExpired();
  }

 private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if(isTokenExpired) this.logout();
    return isTokenExpired;
  }

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if(!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }

  logout = (): void => {
    localStorage.removeItem(this.tokenKey);
  }
}
