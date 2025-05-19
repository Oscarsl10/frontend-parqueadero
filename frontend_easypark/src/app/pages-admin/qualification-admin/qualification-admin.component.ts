import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-qualification-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderAdminComponent],
  templateUrl: './qualification-admin.component.html',
  styleUrl: './qualification-admin.component.css'
})
export class QualificationAdminComponent {
  calificaciones: any[] = [];              // Todas las calificaciones desde el backend
  calificacionesFiltradas: any[] = [];     // Calificaciones que se mostrarán
  loading: boolean = true;                 // Estado de carga
  errorAlert: boolean = false;             // Estado de error
  successAlert: boolean = false;           // Estado de éxito
  filtroCalificacion: string = '';         // Valor seleccionado en el filtro

  constructor(private http: HttpClient, private authService: AuthAdminService) { }

  ngOnInit(): void {
    this.authService.requireLogin();
    this.cargarCalificaciones();
  }

  cargarCalificaciones(): void {
    this.http.get<any[]>('http://localhost:8082/api/calificacion').subscribe(
      (data) => {
        this.calificaciones = data;
        this.aplicarFiltro(); // Aplica filtro con los datos iniciales
        this.loading = false;
        this.successAlert = true;
        setTimeout(() => { this.successAlert = false; }, 3000);
      },
      (error) => {
        this.errorAlert = true;
        this.loading = false;
        setTimeout(() => { this.errorAlert = false; }, 3000);
      }
    );
  }

 aplicarFiltro(): void {
  if (this.filtroCalificacion === '') {
    this.calificacionesFiltradas = this.calificaciones;
  } else {
    this.calificacionesFiltradas = this.calificaciones.filter(
      c => String(c.calificacion) === this.filtroCalificacion
    );
  }
}
}
