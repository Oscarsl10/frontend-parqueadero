import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  standalone: true,
  selector: 'app-booking',
  imports: [CommonModule, HttpClientModule, HeaderUserComponent, RouterModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  usuario: any = null;
  vehiculosUsuario: any[] = [];
  tarifas: any[] = [];
  espaciosDisponibles: any[] = [];
  reservaRealizada: any = null;
  reservas: any[] = []; 
  mostrarFormulario: boolean = false;
  reservaEditando: any = null; // Para saber cuál estás editando




  vehiculoSeleccionadoId: number | null = null;
  tarifaSeleccionadaId: number | null = null;
  espacioSeleccionadoId: number | null = null;

  fechaInicio: string = '';
  fechaFin: string = '';
  precio: number = 0;

  reservaSuccess: boolean = false;
  reservaError: boolean = false;
  datosIncompletos: boolean = false;
  mostrarConfirmacion: boolean = false;
  reservaAEliminar: number | null = null;
  

  constructor(private http: HttpClient, private router: Router, private authService: AuthUserService) { }

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.obtenerUsuario();
    this.obtenerVehiculos();
    this.cargarTarifas();
    this.cargarEspaciosDisponibles();
  }

  obtenerUsuario() {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      this.http.get('http://localhost:8082/api/user').subscribe((usuarios: any[]) => {
        this.usuario = usuarios.find(u => u.email === email);
        if (this.usuario) {
          this.cargarReservasUsuario();  // 👈 Aquí se cargan las reservas
        }
      }, error => {
        console.error('Error al obtener usuario:', error);
      });
    }
  }
  

  

  obtenerVehiculos() {
  this.http.get<any[]>('http://localhost:8082/api/vehiculo').subscribe({
    next: (res) => {
      if (this.usuario) {
        this.vehiculosUsuario = res.filter(v => v.users?.email === this.usuario.email);
      }
    },
    error: (err) => {
      console.error('Error al obtener vehículos:', err);
      this.reservaError = true;
    }
  });
}

  

  cargarTarifas() {
    this.http.get<any[]>('http://localhost:8082/api/tarifa').subscribe({
      next: (res) => this.tarifas = res,
      error: (err) => console.error('Error al cargar tarifas:', err)
    });
  }

  cargarEspaciosDisponibles() {
    this.http.get<any[]>('http://localhost:8082/api/espacio_total').subscribe({
      next: (res) => {
        this.espaciosDisponibles = res.filter(e => e.disponibles != null && e.disponibles > 0);
      },
      error: (err) => console.error('Error al cargar espacios:', err)
    });
  }

  calcularPrecio() {
    const tarifa = this.tarifas.find(t => t.id === this.tarifaSeleccionadaId);
    if (this.fechaInicio && this.fechaFin && tarifa) {
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);

      if (inicio > fin) {
        this.reservaError = true;
        console.error("La fecha de inicio no puede ser posterior a la fecha de fin.");
        return;
      }

      const durationHoras = (fin.getTime() - inicio.getTime()) / (1000 * 3600);

      if (durationHoras > 0) {
        this.precio = tarifa.precio * durationHoras;
      } else {
        this.precio = 0;
      }
    }
  }



  hacerReserva() {
    if (!this.usuario || !this.usuario.email || !this.vehiculoSeleccionadoId || !this.tarifaSeleccionadaId || !this.espacioSeleccionadoId || !this.fechaInicio || !this.fechaFin) {
      this.datosIncompletos = true;
      console.log('Datos incompletos:', this.usuario);
      return;
    }
  
    const espacioTotal = this.espaciosDisponibles.find(e => e.id === this.espacioSeleccionadoId);
    if (!espacioTotal || espacioTotal.disponibles == null || espacioTotal.disponibles <= 0) {
      console.error("El espacio seleccionado no está disponible o no existe.");
      this.reservaError = true;
      return;
    }
  
    espacioTotal.disponibles -= 1;
  
    const vehiculo = this.vehiculosUsuario.find(v => v.id === this.vehiculoSeleccionadoId);
    const tarifa = this.tarifas.find(t => t.id === this.tarifaSeleccionadaId);
  
    if (!vehiculo || !tarifa) {
      console.error("Datos inválidos para la reserva.");
      this.reservaError = true;
      return;
    }
  
    const nuevaReserva = {
      vehiculo: vehiculo,
      tarifa: tarifa,
      espacio: espacioTotal,
      precio: Number(this.precio),
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };
  
    const reserva: any = {
      id: this.reservaEditando?.id, // Verifica si estamos editando
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      vehiculo: vehiculo,
      tarifa: tarifa,
      espacio_total: { id: this.espacioSeleccionadoId },
      precio: Number(this.precio),
      status: true,
      users: { email: this.usuario.email }
    };
  
    console.log("Reserva enviada", JSON.stringify(reserva, null, 2));
  
    if (this.reservaEditando) {
      // Si estamos editando una reserva
      this.http.put(`http://localhost:8082/api/reserva/${reserva.id}`, reserva, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).subscribe({
        next: () => {
          this.http.put(`http://localhost:8082/api/espacio_total/${espacioTotal.id}`, espacioTotal).subscribe({
            next: () => {
              console.log('Reserva actualizada correctamente');
              this.actualizarReservas(reserva);
              this.reservaSuccess = true;
              this.reservaError = false;
              this.datosIncompletos = false;
              this.cargarReservasUsuario();
            },
            error: (err) => {
              console.error('Error al actualizar el espacio:', err);
              this.reservaError = true;
            }
          });
        },
        error: (err) => {
          console.error('Error al actualizar la reserva:', err);
          this.reservaError = true;
        }
      });
    } else {
      // Si es una nueva reserva
      this.http.post('http://localhost:8082/api/reserva', reserva, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).subscribe({
        next: () => {
          this.http.put(`http://localhost:8082/api/espacio_total/${espacioTotal.id}`, espacioTotal).subscribe({
            next: () => {
              console.log('Espacio actualizado correctamente');
              this.reservas.push(nuevaReserva); // Add the new reservation to the array
              this.reservaSuccess = true;
              this.reservaError = false;
              this.datosIncompletos = false;
              this.cargarReservasUsuario();
            },
            error: (err) => {
              console.error('Error al actualizar el espacio:', err);
              this.reservaError = true;
            }
          });
        },
        error: (err) => {
          console.error('Error al hacer la reserva:', err);
          this.reservaError = true;
        }
      });
    }
  }
  
  eliminarReserva(id: number) {
    // Mostramos el modal de confirmación
    this.mostrarConfirmacion = true;
    this.reservaAEliminar = id;
  }

  confirmarEliminacion() {
    if (this.reservaAEliminar !== null) {
      this.http.delete(`http://localhost:8082/api/reserva/${this.reservaAEliminar}`).subscribe({
        next: () => {
          console.log('Reserva eliminada correctamente');
          this.reservaSuccess = true;
          this.reservaError = false;
          this.cargarReservasUsuario();
        },
        error: (err) => {
          console.error('Error al eliminar la reserva:', err);
          this.reservaError = true;
        }
      });
      // Ocultamos el modal después de confirmar
      this.mostrarConfirmacion = false;
    }
  }

  cancelarEliminacion() {
    // Solo ocultamos el modal si se cancela
    this.mostrarConfirmacion = false;
  }

  
  
  // Función para actualizar las reservas (después de editar)
  actualizarReservas(reservaEditada: any) {
    const index = this.reservas.findIndex(r => r.id === reservaEditada.id);
    if (index !== -1) {
      this.reservas[index] = reservaEditada;
    }
  }
  

cargarReservasUsuario() {
  if (this.usuario) {
    this.http.get<any[]>('http://localhost:8082/api/reserva').subscribe({
      next: (res) => {
        this.reservas = res.filter(r => r.users?.email === this.usuario.email);
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
      }
    });
  }
}

editarReserva(reserva: any) {
  this.reservaEditando = reserva;

  // Rellenar el formulario con los datos de la reserva seleccionada
  this.vehiculoSeleccionadoId = reserva.vehiculo?.id;
  this.tarifaSeleccionadaId = reserva.tarifa?.id;
  this.espacioSeleccionadoId = reserva.espacio_total?.id;
  this.fechaInicio = reserva.fechaInicio;
  this.fechaFin = reserva.fechaFin;
  this.precio = reserva.precio;
  this.mostrarFormulario = true;
}


}
