import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule, RouterLink],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {
  userEmail: string | null = null;
  menuOpen = false;
  
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
