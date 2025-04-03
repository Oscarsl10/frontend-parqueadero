import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";

@Component({
  selector: 'app-fee-admin',
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule, HeaderAdminComponent],
  templateUrl: './fee-admin.component.html',
  styleUrl: './fee-admin.component.css'
})
export class FeeAdminComponent {
  nuevaTarifa = {
    precio: null,
    fecha: '',
    tipoVehiculo: ''
  };

  registerSuccess: boolean = false;
  registerError: boolean = false;

  private apiUrl = 'http://localhost:8082/api/tarifa';

  constructor(private http: HttpClient) { }

  agregarTarifa() {
    if (!this.nuevaTarifa.fecha) {
      alert('Por favor, seleccione una fecha válida.');
      return;
    }
  
    this.nuevaTarifa.fecha = new Date(this.nuevaTarifa.fecha).toISOString().split('T')[0];
  
    this.http.post(this.apiUrl, this.nuevaTarifa).subscribe({
      next: (res) => {
        console.log('Tarifa guardada:', res);
        this.registerSuccess = true;
        this.registerError = false;
        setTimeout(() => this.registerSuccess = false, 3000);
      },
      error: (err) => {
        console.error('Error al guardar la tarifa:', err);
        this.registerSuccess = false;
        this.registerError = true;
        setTimeout(() => this.registerError = false, 3000);
      }
    });
  }  
}