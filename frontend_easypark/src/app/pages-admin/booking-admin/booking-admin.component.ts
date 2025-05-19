import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
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
  mensajeConfirmacion: string = '';

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private authService: AuthAdminService
  ) {}

  ngOnInit() {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.cargarReservas();
  }

  cargarReservas() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.reservas = data;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error cargando reservas:', error);
      }
    );
  }

  confirmarReserva(reserva: any) {
    const url = `http://localhost:8082/api/confirmar/${reserva.id}`;
    this.http.put(url, {}).subscribe(
      () => {
        reserva.confirmada = true;
        this.mensajeConfirmacion = `✅ Reserva #${reserva.id} confirmada exitosamente.`;

        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          this.mensajeConfirmacion = '';
        }, 3000);

        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al confirmar la reserva:', error);
        alert('Hubo un error al confirmar la reserva. Intenta nuevamente.');
      }
    );
  }
}