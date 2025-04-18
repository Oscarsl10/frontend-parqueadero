import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../services-user/auth-user.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderUserComponent } from "../header-user/header-user.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plans',
  imports: [HeaderUserComponent, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private authService: AuthUserService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
  }

}
