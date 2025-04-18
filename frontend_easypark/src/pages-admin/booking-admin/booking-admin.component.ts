import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { AuthAdminGuard } from '../guards-admin/auth-admin.guard';
import { Router } from '@angular/router';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-booking-admin',
  imports: [CommonModule, HeaderAdminComponent, HttpClientModule],
  templateUrl: './booking-admin.component.html',
  styleUrl: './booking-admin.component.css'
})
export class BookingAdminComponent {
  reservas: any[] = [];
  apiUrl = 'http://localhost:8082/api/reserva';

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private router: Router, private authService: AuthAdminService) {}

  ngOnInit() {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.cargarReservas();
  }

  cargarReservas() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        console.log('Reservas cargadas:', data);
        this.reservas = data;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error cargando reservas:', error);
      }
    );
  }

  // Ejemplo: filtrar solo reservas activas
  getReservasActivas() {
    return this.reservas.filter(r => r.status === true);
  }
}
