import { Component } from '@angular/core';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [HeaderAdminComponent, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {
  activeAdmins: any[] = [];
  activeUsers: any[] = [];
  facturas: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthAdminService // 👈 Inyectar servicio
  ) {}

  ngOnInit() {
    // 👇 Verifica que haya sesión, si no hay redirige
    this.authService.requireLogin();

    this.loadActiveAdmins();
    this.loadActiveUsers();
    this.loadFacturas();
  }

  irAReserva() {
    this.router.navigate(['admin/reservation']);
  }

  loadActiveAdmins() {
    this.httpClient.get<any[]>('http://localhost:8082/api/admin').subscribe(
      (response) => {
        console.log('Administradores:', response);
        this.activeAdmins = response;
      },
      (error) => {
        console.error('Error al obtener los administradores:', error);
      }
    );
  }

  loadActiveUsers() {
    this.httpClient.get<any[]>('http://localhost:8082/api/user').subscribe(
      (response) => {
        console.log('Usuarios obtenidos del backend:', response);
        if (response && response.length > 0) {
          this.activeUsers = response;
        } else {
          console.warn('No hay usuarios disponibles en la API.');
        }
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  loadFacturas() {
    this.httpClient.get<any[]>('http://localhost:8082/api/factura').subscribe(
      (data) => {
        this.facturas = data;
      },
      (error) => {
        console.error('Error al obtener las facturas:', error);
      }
    );
  }
}
