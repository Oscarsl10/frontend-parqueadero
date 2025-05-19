import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  constructor(private router: Router) { }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('adminEmail');
  }

  getAdminEmail(): string | null {
    return sessionStorage.getItem('adminEmail');
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/admin-login']);
  }

  requireLogin(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/admin-login']);
    }
  }
}
