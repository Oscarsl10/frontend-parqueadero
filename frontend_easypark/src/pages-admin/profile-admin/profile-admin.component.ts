import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";

@Component({
  selector: 'app-profile-admin',
  imports: [RouterModule, HttpClientModule, HeaderAdminComponent],
  templateUrl: './profile-admin.component.html',
  styleUrl: './profile-admin.component.css'
})
export class ProfileAdminComponent {
  adminData: any = {}; // Almacena los datos del admin
  adminEmail: string | null = ''; // Email del admin desde sessionStorage

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.adminEmail = sessionStorage.getItem('adminEmail');
  
    if (this.adminEmail) {
      this.getAdminData();
    } else {
      // Evita que el admin entre si no está logueado
      this.router.navigate(['/admin-login']);
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
          console.log('Datos recibidos del backend:', data); // 👈 Agrega esto
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
    this.adminData = {}; // Limpia los datos del admin
    sessionStorage.clear(); // Borra la sesión del usuario
    this.router.navigate(['/admin/home']); // Redirige al home
  }
  
  
}
