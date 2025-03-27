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
  userEmail: string | null = null; // Estado del usuario autenticado

  constructor(private router: Router) {}

  ngOnInit() {
    // Recupera el correo del usuario desde sessionStorage
    this.userEmail = sessionStorage.getItem('userEmail');
  }

  logout() {
    sessionStorage.clear(); // Limpia los datos almacenados
    this.userEmail = null; // Resetea el estado del usuario
  }
}
