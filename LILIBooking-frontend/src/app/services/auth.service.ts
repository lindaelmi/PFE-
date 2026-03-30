// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  language: string;
  phone?: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Регистрация нового пользователя
   * @param userData Данные пользователя
   * @returns Observable с ответом аутентификации
   */
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(response => this.setUser(response))
    );
  }

  /**
   * Вход в систему
   * @param credentials Учётные данные (email, пароль)
   * @returns Observable с ответом аутентификации
   */
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.setUser(response))
    );
  }

  /**
   * Выход из системы
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  /**
   * Возвращает текущего пользователя
   * @returns User | null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Проверяет, аутентифицирован ли пользователь
   * @returns true, если токен существует
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Возвращает токен доступа
   * @returns строка токена или null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Обновляет язык пользователя
   * @param language код языка
   */
  updateLanguage(language: string): void {
    const user = this.getCurrentUser();
    if (user) {
      user.language = language;
      this.currentUserSubject.next(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Приватные методы
  private setUser(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.access_token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }
}