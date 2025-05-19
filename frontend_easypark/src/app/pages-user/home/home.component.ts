import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userEmail: string | null = null;

  constructor(private router: Router, private authService: AuthUserService) {}

  ngOnInit() {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.userEmail = sessionStorage.getItem('userEmail'); // Obtiene el email almacenado en sesión
  }

  /*goToProfile() {
    this.router.navigate(['/profile']); // Redirige al perfil
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirige a iniciar sesión
  }

  goToRegister() {
    this.router.navigate(['/register']); // Redirige a registrarse
  }*/
 
    logout() {
      sessionStorage.clear(); // Limpia los datos almacenados
      this.userEmail = null; // Resetea el estado del usuario
    }
}

