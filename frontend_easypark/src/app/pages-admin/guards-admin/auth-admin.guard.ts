import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

  constructor(private authService: AuthAdminService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}