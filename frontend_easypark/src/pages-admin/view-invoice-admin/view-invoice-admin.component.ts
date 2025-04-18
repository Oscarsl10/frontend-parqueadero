import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-view-invoice-admin',
  imports: [HeaderAdminComponent, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './view-invoice-admin.component.html',
  styleUrl: './view-invoice-admin.component.css'
})
export class ViewInvoiceAdminComponent implements OnInit{
  facturas: any[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthAdminService) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa

    this.http.get<any[]>('http://localhost:8082/api/factura').subscribe(
      (data) => this.facturas = data,
      (error) => console.error('Error al cargar las facturas:', error)
    );
  }

}
