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
  vehiculo: any = {  // Asegura que esté inicializado
    placa: '',
    tipoVehiculo: '',
    idTarifa: null
  };

  registerSuccess: boolean = false;
  registerError: boolean = false;

  tarifas: any[] = [];
  tarifasFiltradas: any[] = [];

  private apiTarifas = 'http://localhost:8082/api/tarifa';
  private apiVehiculos = 'http://localhost:8082/api/registroVehiculo';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerTarifas();
  }

  obtenerTarifas() {
    this.http.get<any[]>(this.apiTarifas).subscribe(
      (response) => {
        this.tarifas = response;
      },
      (error) => {
        console.error('Error al obtener tarifas:', error);
      }
    );
  }

  filtrarTarifas() {
    this.tarifasFiltradas = this.tarifas.filter(t => t.tipoVehiculo === this.vehiculo.tipoVehiculo);
    this.vehiculo.idTarifa = null; // Reinicia la selección de tarifa
  }

  agregarVehiculo() {
    if (!this.vehiculo.placa || !this.vehiculo.tipoVehiculo || !this.vehiculo.idTarifa) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const vehiculoData = {
      placa: this.vehiculo.placa,
      tipoVehiculo: this.vehiculo.tipoVehiculo,
      tarifa: { id: this.vehiculo.idTarifa }
    };

    this.http.post(this.apiVehiculos, vehiculoData).subscribe(
      (response) => {
        console.log('Vehículo registrado con éxito', response);
        this.registerSuccess = true;
        this.registerError = false;
        setTimeout(() => this.registerSuccess = false, 3000);
      },
      (error) => {
        console.error('Error al registrar vehículo:', error);
        this.registerSuccess = false;
        this.registerError = true;
        setTimeout(() => this.registerError = false, 3000);
      }
    );
  }
}
