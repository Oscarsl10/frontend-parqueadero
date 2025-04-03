import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {
  userEmail: string | null = null;
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('userEmail'); // Obtiene el email almacenado en sesión
  }

  goToProfile() {
    this.router.navigate(['/profile']); // Redirige al perfil
  }
}
