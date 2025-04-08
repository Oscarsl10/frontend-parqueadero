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
    tipoVehiculo: '',
    precioHora: null,
    precioMedioDia: null,
    precioNoche: null,
    precioFestivo: null,
    fecha: ''
  };

  tarifas: any[] = [];
  registerSuccess = false;
  registerError = false;
  updateSuccess = false;
  updateError = false;
  deleteSuccess = false;
  deleteError = false;
  confirmTarifa: any = null;
  validacionError = false;
  mostrarFormulario: boolean = false;

  private apiUrl = 'http://localhost:8082/api/tarifa';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarTarifas();
  }

  cargarTarifas() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.tarifas = data;
      },
      (error) => {
        console.error('Error cargando tarifas:', error);
      }
    );
  }

  getTarifasPorTipo(tipo: string) {
    return this.tarifas.filter(tarifa => tarifa.tipoVehiculo === tipo);
  }

  agregarTarifa() {
    if (!this.nuevaTarifa.tipoVehiculo || !this.nuevaTarifa.fecha) {
      this.validacionError = true;
      setTimeout(() => (this.validacionError = false), 3000);
      return;
    }

    const fechaFormateada = new Date(this.nuevaTarifa.fecha).toISOString().split('T')[0];

    const tarifas = [];

    if (this.nuevaTarifa.precioHora > 0) {
      tarifas.push({ tipoVehiculo: this.nuevaTarifa.tipoVehiculo, nombreTarifa: 'Normal', precio: this.nuevaTarifa.precioHora, fecha: fechaFormateada });
    }
    if (this.nuevaTarifa.precioMedioDia > 0) {
      tarifas.push({ tipoVehiculo: this.nuevaTarifa.tipoVehiculo, nombreTarifa: 'Medio Día', precio: this.nuevaTarifa.precioMedioDia, fecha: fechaFormateada });
    }
    if (this.nuevaTarifa.precioNoche > 0) {
      tarifas.push({ tipoVehiculo: this.nuevaTarifa.tipoVehiculo, nombreTarifa: 'Noche', precio: this.nuevaTarifa.precioNoche, fecha: fechaFormateada });
    }
    if (this.nuevaTarifa.precioFestivo > 0) {
      tarifas.push({ tipoVehiculo: this.nuevaTarifa.tipoVehiculo, nombreTarifa: 'Festivo', precio: this.nuevaTarifa.precioFestivo, fecha: fechaFormateada });
    }

    if (tarifas.length === 0) {
      this.validacionError = true;
      setTimeout(() => (this.validacionError = false), 3000);
      return;
    }

    const yaExiste = tarifas.some(nueva =>
      this.tarifas.some(actual =>
        actual.tipoVehiculo === nueva.tipoVehiculo &&
        actual.nombreTarifa === nueva.nombreTarifa &&
        actual.fecha === nueva.fecha
      )
    );

    if (yaExiste) {
      this.registerError = true;
      setTimeout(() => (this.registerError = false), 3000);
      return;
    }

    let requests = tarifas.map(tarifa =>
      this.http.post(this.apiUrl, tarifa).toPromise()
    );

    Promise.all(requests)
      .then(() => {
        this.registerSuccess = true;
        this.registerError = false;
        this.cargarTarifas();
        this.nuevaTarifa = {
          tipoVehiculo: '',
          precioHora: null,
          precioMedioDia: null,
          precioNoche: null,
          precioFestivo: null,
          fecha: ''
        };
        setTimeout(() => (this.registerSuccess = false), 3000);
      })
      .catch(() => {
        this.registerSuccess = false;
        this.registerError = true;
        setTimeout(() => (this.registerError = false), 3000);
      });
  }
  
  
  editarTarifa(tarifa: any) {
    // Verifica que los datos sean válidos antes de proceder con la actualización
    if (!tarifa.precio || tarifa.precio <= 0) {
      this.updateError = true;
      setTimeout(() => (this.updateError = false), 3000);
      return;
    }
  
    const tarifaActualizada = {
      ...tarifa,
      precio: tarifa.precio, // El precio actualizado
    };
  
    // Enviar solicitud PUT al backend
    this.http.put(`${this.apiUrl}/${tarifa.id}`, tarifaActualizada).subscribe(
      () => {
        this.updateSuccess = true;
        this.updateError = false;
        this.cargarTarifas(); // Recargar las tarifas después de actualizar
        setTimeout(() => (this.updateSuccess = false), 3000);
      },
      () => {
        this.updateSuccess = false;
        this.updateError = true;
        setTimeout(() => (this.updateError = false), 3000);
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

    const id = this.confirmTarifa.id;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(
      () => {
        this.deleteSuccess = true;
        this.confirmTarifa = null;
        this.cargarTarifas();
        setTimeout(() => (this.deleteSuccess = false), 3000);
      },
      () => {
        this.deleteError = true;
        setTimeout(() => (this.deleteError = false), 3000);
      }
    );
  }

}
