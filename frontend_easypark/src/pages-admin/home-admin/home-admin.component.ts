import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";

@Component({
  selector: 'app-home-admin',
  imports: [CommonModule, RouterModule, HeaderAdminComponent],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {
  adminEmail: string | null = null; // Estado del usuario autenticado

  constructor(private router: Router) {}

  ngOnInit() {
    // Recupera el correo del usuario desde sessionStorage
    this.adminEmail = sessionStorage.getItem('adminEmail');
  }

  /*goToProfile() {
    this.router.navigate(['/admin/profile']); // Redirige al perfil
  }

  goToLogin() {
    this.router.navigate(['/admin/login']); // Redirige a iniciar sesión
  }*/

  logout() {
    sessionStorage.clear(); // Limpia los datos almacenados
    this.adminEmail = null; // Resetea el estado del usuario
  }
}
