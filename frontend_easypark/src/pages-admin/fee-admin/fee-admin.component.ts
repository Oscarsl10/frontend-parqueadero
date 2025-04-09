import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { FeeReadComponent } from "../fee-read/fee-read.component";

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
    nombreTarifa: '',
    precio: null,
    fecha: ''
  };

  // NUEVO TIPO VEHÍCULO
  nuevoTipoVehiculo = {
    nombre: ''
  };

  tarifas: any[] = [];
  tiposVehiculo: any[] = [];

  // ALERTAS
  registerSuccess = false;
  registerError = false;
  updateSuccess = false;
  updateError = false;
  deleteSuccess = false;
  deleteError = false;
  validacionError = false;
  confirmTarifa: any = null;
  mostrarFormulario = false;
  mostrarFormularioTipoVehiculo = false;
  tipoVehiculoSuccess = false;
  tipoVehiculoError = false;
  tipoVehiculoDuplicado = false;

  private tarifaUrl = 'http://localhost:8082/api/tarifa';
  private vehiculoUrl = 'http://localhost:8082/api/tipo_vehiculo';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarTarifas();
    this.cargarTiposVehiculo();
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
  

  // REGISTRO DE NUEVA TARIFA
  agregarTarifa() {
    const { tipoVehiculoId, nombreTarifa, precio, fecha } = this.nuevaTarifa;
  
    if (!tipoVehiculoId || !nombreTarifa || !precio || !fecha) {
      this.validacionError = true;
      setTimeout(() => this.validacionError = false, 3000);
      return;
    }
  
    const tipoSeleccionado = this.tiposVehiculo.find(v => v.id === parseInt(tipoVehiculoId));
    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
  
    const tarifa = {
      tipo_vehiculo: { id: tipoVehiculoId },
      nombreTarifa,
      precio,
      fecha: fechaFormateada
    };
    

    this.http.post(this.tarifaUrl, tarifa).subscribe(
      () => {
        this.registerSuccess = true;
        this.registerError = false;
        this.cargarTarifas();
        this.nuevaTarifa = {
          tipoVehiculoId: '',
          nombreTarifa: '',
          precio: null,
          fecha: ''
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
  
  
  getTarifasPorTipo(tipoVehiculo: string) {
    return this.tarifas.filter(t => t.tipo_vehiculo?.tipo_vehiculo === tipoVehiculo);
  }
  

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

  confirmarEliminacion(tarifa: any) {
    this.confirmTarifa = tarifa;
  }

  cancelarEliminacion() {
    this.confirmTarifa = null;
  }

  eliminarTarifa() {
    if (!this.confirmTarifa) return;
  
    console.log('Eliminando tarifa con ID:', this.confirmTarifa.id); // 👈 VERIFICACIÓN
  
    this.http.delete(`${this.tarifaUrl}/${this.confirmTarifa.id}`).subscribe(
      () => {
        this.deleteSuccess = true;
        this.cargarTarifas();
        this.confirmTarifa = null;
        setTimeout(() => this.deleteSuccess = false, 3000);
      },
      (error) => {
        console.error('Error al eliminar tarifa:', error); // 👈 VERIFICA SI HAY ERROR
        this.deleteError = true;
        setTimeout(() => this.deleteError = false, 3000);
      }
    );
  }  
}
