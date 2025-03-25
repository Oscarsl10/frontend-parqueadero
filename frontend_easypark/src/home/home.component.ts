import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user: any = null;
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']); // Aquí redirigiría al perfil
  }
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/']);
  }
}
