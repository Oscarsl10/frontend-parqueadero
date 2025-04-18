import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-plans-admin',
  imports: [HeaderAdminComponent, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './plans-admin.component.html',
  styleUrls: ['./plans-admin.component.css']
})
export class PlansAdminComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private authService: AuthAdminService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
  }

}
