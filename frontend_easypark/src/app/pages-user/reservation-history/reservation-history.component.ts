import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  selector: 'app-reservation-history',
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderUserComponent],
  templateUrl: './reservation-history.component.html',
  styleUrl: './reservation-history.component.css'
})
export class ReservationHistoryComponent {
pagos: any[] = [];
  loading: boolean = true; // Agregar indicador de carga

  constructor(private http: HttpClient, private authService: AuthUserService) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.cargarPagosUsuario();
  }

  cargarPagosUsuario(): void {
    const email = sessionStorage.getItem('userEmail'); // Obtener el email del usuario desde sessionStorage
    if (email) {
      this.http.get<any[]>(`http://localhost:8082/api/pago-reserva`).subscribe({
        next: (pagos) => {
          // Verificar la estructura y filtrar pagos según el email
          this.pagos = pagos.filter(pago => pago.reserva?.users?.email === email); // Asegúrate de que la estructura sea correcta
          this.loading = false; // Cambiar indicador de carga
        },
        error: (err) => {
          console.error('Error al cargar pagos:', err);
          this.loading = false; // Cambiar indicador de carga en caso de error
        }
      });
    } else {
      console.warn('No se encontró el email del usuario en sessionStorage');
      this.loading = false; // Cambiar indicador de carga si no se encuentra el email
    }
  }
}
