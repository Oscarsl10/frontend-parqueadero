import { Component } from '@angular/core';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  imports: [HeaderAdminComponent, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {
  activeAdmins: any[] = []; // Lista de administradores (empleados)
  activeUsers: any[] = [];  // Lista de usuarios (clientes)

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.loadActiveAdmins();
    this.loadActiveUsers();
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
        console.log('Usuarios obtenidos del backend:', response); // Verificar la respuesta
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
}
