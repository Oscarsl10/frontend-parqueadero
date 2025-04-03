import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderUserComponent } from '../header-user/header-user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userEmail: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('userEmail'); // Obtiene el email almacenado en sesión
  }

  goToProfile() {
    this.router.navigate(['/profile']); // Redirige al perfil
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirige a iniciar sesión
  }

  goToRegister() {
    this.router.navigate(['/register']); // Redirige a registrarse
  }
}

