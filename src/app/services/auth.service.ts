import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECTO para jwt-decode v4+

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'asistencia_token';
  private userSubject = new BehaviorSubject<string | null>(this.getUsernameFromToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string; role: string; username: string }>(
      `${environment.apiUrl}/auth/login`,
      { username, password }
    );
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.userSubject.next(this.getUsernameFromToken());
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const dec: any = jwtDecode(t); // ✅ cambio aquí
      return dec?.role || dec?.roles || dec?.rol || null;
    } catch {
      return null;
    }
  }

  getUsernameFromToken(): string | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const dec: any = jwtDecode(t); // ✅ cambio aquí
      return dec?.sub || dec?.username || null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  user$(): Observable<string | null> {
    return this.userSubject.asObservable();
  }
}

