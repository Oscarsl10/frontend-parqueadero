import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent {
  adminEmail: string | null = null;
  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.adminEmail = sessionStorage.getItem('adminEmail');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
