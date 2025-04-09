import { CommonModule, formatCurrency } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";

@Component({
  selector: 'app-vehicule-admin',
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule, HeaderAdminComponent],
  templateUrl: './vehicule-admin.component.html',
  styleUrls: ['./vehicule-admin.component.css']
})
export class VehiculeAdminComponent implements OnInit {
  vehiculo = {
    placa: '',
    tipoVehiculoId: null,
    idTarifa: null,
    entrada: ''
  };

  tarifas: any[] = [];
  tarifasFiltradas: any[] = [];
  tiposVehiculo: any[] = [];

  registerSuccess = false;
  registerError = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerTarifas();
  }

  obtenerTarifas() {
    this.http.get<any[]>('http://localhost:8082/api/tarifa').subscribe(
      data => {
        this.tarifas = data;

        const tiposUnicos = new Map();
        data.forEach(t => tiposUnicos.set(t.tipo_vehiculo.id, t.tipo_vehiculo));
        this.tiposVehiculo = Array.from(tiposUnicos.values());
      },
      error => {
        console.error('Error al cargar tarifas:', error);
      }
    );
  }

  filtrarTarifasPorVehiculo() {
    const tipoId = parseInt(this.vehiculo.tipoVehiculoId);

    if (!tipoId) {
      this.tarifasFiltradas = [];
      return;
    }

    this.tarifasFiltradas = this.tarifas.filter(t => t.tipo_vehiculo?.id === tipoId);
  }

  obtenerNombreTipoVehiculo(id: number): string {
    const tipo = this.tiposVehiculo.find(t => t.id === id);
    return tipo ? tipo.tipo_vehiculo : '';
  }

  agregarVehiculo() {
    if (!this.vehiculo.placa || !this.vehiculo.tipoVehiculoId || !this.vehiculo.idTarifa || !this.vehiculo.entrada) {
      this.registerError = true;
      setTimeout(() => this.registerError = false, 3000);
      return;
    }

    const datos = {
      placa: this.vehiculo.placa,
      tipoVehiculo: this.obtenerNombreTipoVehiculo(parseInt(this.vehiculo.tipoVehiculoId)),
      tarifa: { id: parseInt(this.vehiculo.idTarifa) },
      entrada: this.vehiculo.entrada  // Fecha y hora en formato ISO
    };

    this.http.post('http://localhost:8082/api/registroVehiculo', datos).subscribe(
      () => {
        this.registerSuccess = true;
        this.registerError = false;
        this.resetFormulario();
        setTimeout(() => this.registerSuccess = false, 3000);
      },
      () => {
        this.registerError = true;
        this.registerSuccess = false;
        setTimeout(() => this.registerError = false, 3000);
      }
    );
  }

  resetFormulario() {
    this.vehiculo = {
      placa: '',
      tipoVehiculoId: '',
      idTarifa: '',
      entrada: ''
    };
    this.tarifasFiltradas = [];
 
  }
}
