import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserData } from "@shared/interfaces/userData.interface";
import { BehaviorSubject, map, Observable } from "rxjs";
import { QuizService } from "@services/quiz.service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  public isAuth$ = new BehaviorSubject<boolean>(false);
  public username$ = new BehaviorSubject<string>('');
  private _url = 'http://localhost:8080/api/auth/';
  private _headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private _jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private quizService: QuizService) {
    const user = JSON.parse(sessionStorage.getItem('user')!);
    if (user) {
      const isTokenExpired = this._jwtHelper.isTokenExpired(user.token);
      if (!isTokenExpired) {
        this.isAuth$.next(true);
        this.username$.next(user.username);
      }
    }
  }

  public registerUser(userData: Partial<UserData>): Observable<any> {
    return this.http.post(this._url + 'register', userData, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public loginUser(userData: Partial<UserData>): Observable<any> {
    return this.http.post(this._url + 'login', userData, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public storeUser(user: UserData): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.username$.next(user.username);
    this.isAuth$.next(true);
  }

  public logoutUser(): void {
    this.isAuth$.next(false);
    sessionStorage.clear();
    this.quizService.resetQuizzes();
  }

}