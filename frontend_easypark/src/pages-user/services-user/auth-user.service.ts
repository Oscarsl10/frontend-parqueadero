import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  constructor(private router: Router) { }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userEmail');
  }

  getAdminEmail(): string | null {
    return sessionStorage.getItem('userEmail');
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  requireLogin(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
}
