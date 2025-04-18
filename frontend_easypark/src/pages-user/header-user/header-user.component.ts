import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent {
  userEmail: string | null = null;
  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('userEmail');
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
