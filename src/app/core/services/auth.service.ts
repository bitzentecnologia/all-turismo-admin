import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload, UserRole } from '@shared/models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private cookieService: CookieService) {}

  getToken(): string | null {
    return this.cookieService.get('accessToken') || null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload: JwtPayload = jwtDecode(token);

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload: JwtPayload = jwtDecode(token);
      return payload.role;
    } catch {
      return null;
    }
  }

  logout(): void {
    this.cookieService.delete('accessToken');
  }
}
