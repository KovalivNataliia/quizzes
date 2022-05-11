import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserReqData } from "@shared/interfaces/userReqData.interface";
import { UserResData } from "@shared/interfaces/userResData.interface";
import { BehaviorSubject, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  public isAuth = new BehaviorSubject<boolean>(false);
  public username = new BehaviorSubject<string>('');
  private _url = 'http://localhost:8080/api/auth/'
  private _headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { 
    this.isAuth.next(!!sessionStorage.getItem('userToken'));
    this.username.next(sessionStorage.getItem('userName')!);
  }

  public registerUser(userData: UserReqData): Observable<UserResData> {
    return this.http.post(this._url + 'register', userData, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public loginUser(userData: UserReqData): Observable<UserResData> {
    return this.http.post(this._url + 'login', userData, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public storeUser(token: string, username: string): void {
    sessionStorage.setItem('userToken', token);
    sessionStorage.setItem('userName', username);
    this.username.next(username)
    this.isAuth.next(true);
  }

  public logoutUser(): void {
    this.isAuth.next(false);
    sessionStorage.clear();
  }

}