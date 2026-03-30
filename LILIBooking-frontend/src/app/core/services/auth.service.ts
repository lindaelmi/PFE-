import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authUrl = this.apiUrl;           // ✅ Correction : on garde le préfixe /api
  private tokenKey = 'auth_token';
  
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.authUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.loadUserFromToken();
      })
    );
  }

  register(userData: any): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.authUrl}/auth/register`, userData).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.loadUserFromToken();
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const user = this.userSubject.value;
    return user ? user.role : null;
  }

  // ✅ Mise à jour de l'utilisateur dans le BehaviorSubject
  updateUser(updatedUser: any): void {
    this.userSubject.next(updatedUser);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userSubject.next({
        id: payload.sub,
        email: payload.email,
        role: payload.role
      });
    } catch (e) {
      console.error('Token invalide', e);
      this.logout();
    }
  }
}