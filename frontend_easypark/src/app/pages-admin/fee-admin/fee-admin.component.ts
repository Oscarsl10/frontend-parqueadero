import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { FeeReadComponent } from "../fee-read/fee-read.component";
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-fee-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule, HeaderAdminComponent],
  templateUrl: './fee-admin.component.html',
  styleUrls: ['./fee-admin.component.css'] // ← aquí estaba mal escrito como `styleUrl`
})
export class FeeAdminComponent implements OnInit {

  nuevaTarifa = {
    tipoVehiculoId: '',
    tipoTarifaId: '',
    precio: null
  }; 

  // NUEVO TIPO VEHÍCULO
  nuevoTipoVehiculo = {
    nombre: ''
  };

  // NUEVO TIPO TARIFA
  nuevoTipoTarifa = { nombre: '' };



  // LISTAS
  tarifas: any[] = [];
  tiposVehiculo: any[] = [];
  tiposTarifa: any[] = [];

  // ALERTAS
  registerSuccess = false;
  registerError = false;
  updateSuccess = false;
  updateError = false;
  deleteSuccess = false;
  deleteError = false;
  validacionError = false;
  confirmTarifa: any = null;

  // CONTROL DE FORMULARIOS
  mostrarFormulario = false;
  mostrarFormularioTipoVehiculo = false;
  mostrarFormularioTipoTarifa = false; // ← ESTA ES LA NUEVA PROPIEDAD

  // ESTADOS PARA TIPO VEHÍCULO
  tipoVehiculoSuccess = false;
  tipoVehiculoError = false;
  tipoVehiculoDuplicado = false;

  // ESTADOS PARA TIPO TARIFA
  tipoTarifaSuccess = false;
  tipoTarifaError = false;
  tipoTarifaDuplicado = false;

  // URLs de API
  private tarifaUrl = 'http://localhost:8082/api/tarifa';
  private vehiculoUrl = 'http://localhost:8082/api/tipo_vehiculo';
  private tipoTarifaUrl = 'http://localhost:8082/api/tipo_tarifa';

  constructor( private http: HttpClient, private authService: AuthAdminService, private router: Router) {}

  ngOnInit() {
    this.authService.requireLogin();
    this.cargarTarifas();
    this.cargarTiposVehiculo();
    this.cargarTiposTarifa();
  }

  cargarTarifas() {
    this.http.get<any[]>(this.tarifaUrl).subscribe(
      data => this.tarifas = data,
      error => console.error('Error cargando tarifas:', error)
    );
  }

  cargarTiposVehiculo() {
    this.http.get<any[]>(this.vehiculoUrl).subscribe(data => {
      this.tiposVehiculo = data;
    });
  }

  cargarTiposTarifa() {
    this.http.get<any[]>(this.tipoTarifaUrl).subscribe(data => {
      this.tiposTarifa = data;
    });
  }

  // REGISTRO DE NUEVA TARIFA
  agregarTarifa() {
    const { tipoVehiculoId, tipoTarifaId, precio } = this.nuevaTarifa;
  
    if (!tipoVehiculoId || !tipoTarifaId || !precio) {
      this.validacionError = true;
      setTimeout(() => this.validacionError = false, 3000);
      return;
    }
  
    const tarifa = {
      tipo_vehiculo: { id: tipoVehiculoId },
      tipo_tarifa: { id: tipoTarifaId },
      precio
    };
  
    this.http.post(this.tarifaUrl, tarifa).subscribe(
      () => {
        this.registerSuccess = true;
        this.registerError = false;
        this.cargarTarifas();
        this.nuevaTarifa = {
          tipoVehiculoId: '',
          tipoTarifaId: '',
          precio: null
        };
        setTimeout(() => this.registerSuccess = false, 3000);
      },
      () => {
        this.registerSuccess = false;
        this.registerError = true;
        setTimeout(() => this.registerError = false, 3000);
      }
    );
  }
  
  

  // REGISTRO DE NUEVO TIPO DE VEHÍCULO
  agregarTipoVehiculo() {
    const nombreNuevo = this.nuevoTipoVehiculo.nombre.trim().toLowerCase();

    const existe = this.tiposVehiculo.some(tv => tv.tipo_vehiculo.trim().toLowerCase() === nombreNuevo);

    if (existe) {
      this.tipoVehiculoDuplicado = true;
      this.tipoVehiculoError = false;
      this.tipoVehiculoSuccess = false;
      setTimeout(() => this.tipoVehiculoDuplicado = false, 3000);
      return;
    }

    const nuevo = {
      tipo_vehiculo: this.nuevoTipoVehiculo.nombre.trim()
    };

    this.http.post(this.vehiculoUrl, nuevo).subscribe(
      () => {
        this.tipoVehiculoSuccess = true;
        this.tipoVehiculoError = false;
        this.tipoVehiculoDuplicado = false;
        this.nuevoTipoVehiculo.nombre = '';
        this.cargarTiposVehiculo();
        setTimeout(() => this.tipoVehiculoSuccess = false, 3000);
      },
      () => {
        this.tipoVehiculoSuccess = false;
        this.tipoVehiculoError = true;
        this.tipoVehiculoDuplicado = false;
        setTimeout(() => this.tipoVehiculoError = false, 3000);
      }
    );
  }

  // REGISTRO DE NUEVO TIPO DE TARIFA
  registrarTipoTarifa() {
    const nuevoNombre = this.nuevoTipoTarifa.nombre?.trim().toLowerCase();
  
    const existe = this.tiposTarifa.some(tt => tt.tipo_tarifa.trim().toLowerCase() === nuevoNombre);
  
    if (!nuevoNombre) {
      this.tipoTarifaError = true;
      this.tipoTarifaSuccess = false;
      this.tipoTarifaDuplicado = false;
      setTimeout(() => this.tipoTarifaError = false, 3000);
      return;
    }
  
    if (existe) {
      this.tipoTarifaDuplicado = true;
      this.tipoTarifaSuccess = false;
      this.tipoTarifaError = false;
      setTimeout(() => this.tipoTarifaDuplicado = false, 3000);
      return;
    }
  
    const nuevoTipo = { tipo_tarifa: this.nuevoTipoTarifa.nombre.trim() };
  
    this.http.post(this.tipoTarifaUrl, nuevoTipo).subscribe(
      () => {
        this.tipoTarifaSuccess = true;
        this.tipoTarifaError = false;
        this.tipoTarifaDuplicado = false;
        this.nuevoTipoTarifa = { nombre: '' }; // importante
        this.cargarTiposTarifa();
        setTimeout(() => this.tipoTarifaSuccess = false, 3000);
      },
      () => {
        this.tipoTarifaSuccess = false;
        this.tipoTarifaError = true;
        this.tipoTarifaDuplicado = false;
        setTimeout(() => this.tipoTarifaError = false, 3000);
      }
    );
  }
  

  // FILTRAR TARIFAS POR TIPO
  getTarifasPorTipo(tipoVehiculo: string) {
    return this.tarifas.filter(t => t.tipo_vehiculo?.tipo_vehiculo === tipoVehiculo);
  }

  // EDITAR TARIFA
  editarTarifa(tarifa: any) {
    if (!tarifa.precio || tarifa.precio <= 0) {
      this.updateError = true;
      setTimeout(() => this.updateError = false, 3000);
      return;
    }

    this.http.put(`${this.tarifaUrl}/${tarifa.id}`, tarifa).subscribe(
      () => {
        this.updateSuccess = true;
        this.cargarTarifas();
        setTimeout(() => this.updateSuccess = false, 3000);
      },
      () => {
        this.updateError = true;
        setTimeout(() => this.updateError = false, 3000);
      }
    );
  }

  // CONFIRMAR / CANCELAR / ELIMINAR
  confirmarEliminacion(tarifa: any) {
    this.confirmTarifa = tarifa;
  }

  cancelarEliminacion() {
    this.confirmTarifa = null;
  }

  eliminarTarifa() {
    if (!this.confirmTarifa) return;

    this.http.delete(`${this.tarifaUrl}/${this.confirmTarifa.id}`).subscribe(
      () => {
        this.deleteSuccess = true;
        this.cargarTarifas();
        this.confirmTarifa = null;
        setTimeout(() => this.deleteSuccess = false, 3000);
      },
      (error) => {
        console.error('Error al eliminar tarifa:', error);
        this.deleteError = true;
        setTimeout(() => this.deleteError = false, 3000);
      }
    );
  }
  
}