import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthUserService } from '../services-user/auth-user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthUserGuard implements CanActivate {

  constructor(private authService: AuthUserService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}