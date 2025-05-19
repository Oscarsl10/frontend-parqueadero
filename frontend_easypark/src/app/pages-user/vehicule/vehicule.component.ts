import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderUserComponent } from "../header-user/header-user.component";
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  selector: 'app-vehicule',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, HeaderUserComponent],
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent {
  vehiculo = { placa: '', tipoVehiculo: '', color: '' };
  vehiculos = [];
  loginSuccess: boolean = false;
  loginError: boolean = false;
  dataInvalid: boolean = false;
  deleteSuccess: boolean = false; // nueva alerta
  confirmationPending: boolean = false; // Para mostrar la alerta de confirmación

  userEmail: string = sessionStorage.getItem('userEmail') || '';
  vehiculoAEliminarId: number | null = null; // Variable para almacenar el ID del vehículo a eliminar

  constructor(private http: HttpClient, private router: Router, private authService: AuthUserService) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.cargarVehiculos();
  }

  agregarVehiculo() {
    if (!this.vehiculo.placa || !this.vehiculo.tipoVehiculo || !this.vehiculo.color) {
      this.dataInvalid = true;
      this.ocultarAlerta('dataInvalid');
      return;
    }

    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
      this.loginError = true;
      this.ocultarAlerta('loginError');
      return;
    }

    this.http.get<any[]>('http://localhost:8082/api/vehiculo').subscribe(
      (vehiculos) => {
        const placaExistente = vehiculos.find(v => v.placa === this.vehiculo.placa);
        
        if (placaExistente) {
          this.loginError = true;
          this.ocultarAlerta('loginError');
          return;
        }

        this.registrarVehiculo(userEmail);
      },
      (error) => {
        console.error('Error al validar la placa:', error);
        this.loginError = true;
        this.ocultarAlerta('loginError');
      }
    );
  }

  registrarVehiculo(userEmail: string) {
    const vehiculoData = {
      placa: this.vehiculo.placa,
      tipoVehiculo: this.vehiculo.tipoVehiculo,
      color: this.vehiculo.color,
      users: { email: userEmail }
    };

    this.http.post('http://localhost:8082/api/vehiculo', vehiculoData).subscribe(
      (response) => {
        console.log('Vehículo registrado exitosamente:', response);
        this.loginSuccess = true;
        this.ocultarAlerta('loginSuccess');
        this.cargarVehiculos();
      },
      (error) => {
        console.error('Error al registrar el vehículo:', error);
        this.loginError = true;
        this.ocultarAlerta('loginError');
      }
    );
  }

  cargarVehiculos() {
    const userEmail = sessionStorage.getItem('userEmail');
    this.http.get<any[]>('http://localhost:8082/api/vehiculo').subscribe(
      (response) => {
        this.vehiculos = response.filter(v => v.users?.email === userEmail);
      },
      (error) => {
        console.error('Error al cargar los vehículos:', error);
      }
    );
  }

  // Método para mostrar la alerta de confirmación personalizada
  mostrarConfirmacion(id: number) {
    this.vehiculoAEliminarId = id;
    this.confirmationPending = true; // Mostrar la alerta
  }

  // Método para cancelar la eliminación
  cancelarEliminacion() {
    this.vehiculoAEliminarId = null;
    this.confirmationPending = false;
  }

  // Método para confirmar la eliminación
  confirmarEliminacion() {
    if (this.vehiculoAEliminarId !== null) {
      this.http.delete(`http://localhost:8082/api/vehiculo/${this.vehiculoAEliminarId}`).subscribe(
        () => {
          // Quitar el vehículo del listado en el frontend
          this.vehiculos = this.vehiculos.filter(v => v.id !== this.vehiculoAEliminarId);
          this.deleteSuccess = true;
          this.ocultarAlerta('deleteSuccess');
          console.log('Vehículo eliminado correctamente.');
  
          // Limpiar los campos del formulario
          this.vehiculo = { placa: '', tipoVehiculo: '', color: '' };
  
          // Cerrar la confirmación después de eliminar correctamente
          this.cancelarEliminacion();
        },
        (error) => {
          console.error('Error al eliminar el vehículo:', error);
          this.loginError = true;
          this.ocultarAlerta('loginError');
  
          // Limpiar los campos del formulario también si ocurre un error
          this.vehiculo = { placa: '', tipoVehiculo: '', color: '' };
  
          // Cerrar la confirmación también si ocurre un error
          this.cancelarEliminacion();
        }
      );
    } else {
      // Si no hay ID para eliminar, cancelar la acción y limpiar los campos
      this.cancelarEliminacion();
      this.vehiculo = { placa: '', tipoVehiculo: '', color: '' };
    }
  }
  
  ocultarAlerta(alerta: string) {
    setTimeout(() => {
      this[alerta] = false; 
    }, 2000); 
  }
}
