import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-profile-admin',
  imports: [RouterModule, HttpClientModule, HeaderAdminComponent],
  templateUrl: './profile-admin.component.html',
  styleUrl: './profile-admin.component.css'
})
export class ProfileAdminComponent {
  adminData: any = {};
  adminEmail: string | null = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthAdminService
  ) {}

  ngOnInit(): void {
    // ✅ Verifica si hay sesión; si no, redirige automáticamente
    this.authService.requireLogin();

    this.adminEmail = sessionStorage.getItem('adminEmail');

    if (this.adminEmail) {
      this.getAdminData();
    }
  }

  getAdminData(): void {
    if (!this.adminEmail) {
      console.error('No se encontró un email válido para la consulta.');
      return;
    }

    this.http.get<any>(`http://localhost:8082/api/getAdmin/${this.adminEmail}`)
      .subscribe(
        (data) => {
          console.log('Datos recibidos del backend:', data);
          if (data) {
            this.adminData = data;
          } else {
            console.warn('No se encontraron datos para el admin.');
          }
        },
        (error) => {
          console.error('Error al obtener los datos del admin:', error);
        }
      );
  }

  logout() {
    this.adminData = {};
    this.authService.logout(); // ✅ Usa el servicio para cerrar sesión correctamente
    this.router.navigate(['/admin/login']);
  }
}
