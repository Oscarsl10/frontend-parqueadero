import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  adminEmail: string | null = null;
  menuOpen = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    this.adminEmail = sessionStorage.getItem('adminEmail'); // Obtiene el email almacenado en sesión
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
