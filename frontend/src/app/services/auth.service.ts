import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8000/api';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getToken()) this.fetchMe().subscribe({ error: () => this.logout() });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(res => { localStorage.setItem('token', res.token); this.userSubject.next(res.user); })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API}/auth/register`, { name, email, password }).pipe(
      tap(res => { localStorage.setItem('token', res.token); this.userSubject.next(res.user); })
    );
  }

  fetchMe(): Observable<User> {
    return this.http.get<User>(`${this.API}/auth/me`).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  logout(): void { localStorage.removeItem('token'); this.userSubject.next(null); }
  getToken(): string | null { return localStorage.getItem('token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  getUser(): User | null { return this.userSubject.value; }
}
