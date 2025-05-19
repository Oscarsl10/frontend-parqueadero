import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-pay-admin',
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule, HeaderAdminComponent],
  templateUrl: './pay-admin.component.html',
  styleUrls: ['./pay-admin.component.css']
})
export class PayAdminComponent implements OnInit {
  // Para búsqueda de reservas
  placaBuscar: string = '';
  reservasConfirmadas: any[] = [];

  // Para pagos y facturas
  placa: string = '';
  vehiculoEncontrado = false;
  vehiculoId: number | null = null;
  entrada: string = '';
  tipoVehiculo: string = '';
  tarifa: any = null;
  salida: string = '';
  valorAPagar: number = 0;

  // Método de pago
  metodoPago: string = 'EFECTIVO';

  // Estados UI
  registerSuccess = false;
  registerError = false;
  updateSuccess = false;
  updateError = false;
  idFacturaGenerada: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.requireLogin();
  }

  /** BUSCAR RESERVAS POR PLACA **/
  buscarReservas(): void {
    if (!this.placaBuscar.trim()) {
      this.updateError = false;
      this.updateSuccess = false;
      return;
    }
    this.http
      .get<any[]>(`http://localhost:8082/api/reserva-confirmada?placa=${this.placaBuscar}`)
      .subscribe({
        next: data => this.reservasConfirmadas = data,
        error: () => {
          this.reservasConfirmadas = [];
          this.updateError = true;
          setTimeout(() => this.updateError = false, 3000);
        }
      });
  }

  /** ACTUALIZAR fechaFin de la reserva **/
  actualizarFechaFin(reserva: any): void {
    this.http
      .put<any>(`http://localhost:8082/api/reserva/${reserva.id}`, reserva)
      .subscribe({
        next: () => {
          this.updateSuccess = true;
          setTimeout(() => this.updateSuccess = false, 3000);
        },
        error: () => {
          this.updateError = true;
          setTimeout(() => this.updateError = false, 3000);
        }
      });
  }

  /** REGISTRAR PAGO DESDE RESERVA **/
  registrarPagoDesdeReserva(reserva: any): void {
    const pagoReserva = {
      reserva: { id: reserva.id },
      vehiculo: { id: reserva.vehiculo.id },
      status: true,
      metodoPago: this.metodoPago
    };
    this.http.post<any>('http://localhost:8082/api/pago-reserva', pagoReserva)
      .subscribe({
        next: pago => {
          this.registerSuccess = true;
          this.registerError = false;
          this.obtenerFacturaReserva(pago.id);
          setTimeout(() => this.registerSuccess = false, 3000);
        },
        error: () => {
          this.registerError = true;
          this.registerSuccess = false;
          setTimeout(() => this.registerError = false, 3000);
        }
      });
  }

  private obtenerFacturaReserva(pagoId: number): void {
    this.http.get<any>(`http://localhost:8082/api/factura-reserva/pago/${pagoId}`)
      .subscribe(factura => this.idFacturaGenerada = factura.id);
  }

  /** BUSCAR VEHÍCULO PARA PAGO NORMAL **/
  buscarVehiculo(): void {
    this.http.get<any[]>('http://localhost:8082/api/registroVehiculo')
      .subscribe(data => {
        const v = data.find(x => x.placa.toLowerCase() === this.placa.toLowerCase());
        if (v) {
          this.vehiculoEncontrado = true;
          this.vehiculoId = v.id;
          this.entrada = v.entrada;
          this.tipoVehiculo = v.tipoVehiculo;
          this.tarifa = v.tarifa;
        } else {
          this.vehiculoEncontrado = false;
          this.registerError = true;
          setTimeout(() => this.registerError = false, 3000);
        }
      });
  }

  /** REGISTRAR PAGO NORMAL **/
  registrarPago(): void {
    if (!this.vehiculoId || !this.salida) {
      this.registerError = true;
      setTimeout(() => this.registerError = false, 3000);
      return;
    }
    // Cálculo valorAPagar
    const entradaDate = new Date(this.entrada);
    const salidaDate = new Date(this.salida);
    const diffMs = salidaDate.getTime() - entradaDate.getTime();
    const totalMinutes = diffMs / 60000;
    const totalHours = totalMinutes / 60;
    const days = Math.floor(totalHours / 24);
    const remHours = totalHours % 24;
    const remMinutes = totalMinutes % 60;

    let pagar = days * this.tarifa.precio * 24;
    if (remHours > 0 || remMinutes > 0) {
      let hFinal = remHours;
      if (remMinutes > 30) hFinal += 1;
      else if (remMinutes > 0) hFinal += 0.5;
      pagar += hFinal * this.tarifa.precio;
    }
    this.valorAPagar = pagar;

    const datosPago = {
      salida: this.salida,
      valorAPagar: this.valorAPagar,
      registroVehiculo: { id: this.vehiculoId },
      tarifa: { id: this.tarifa.id },
      metodoPago: this.metodoPago
    };

    this.http.post<any>('http://localhost:8082/api/pago', datosPago)
      .subscribe({
        next: pago => {
          this.registerSuccess = true;
          this.registerError = false;
          this.obtenerFacturaNormal(pago.id);
          setTimeout(() => this.registerSuccess = false, 3000);
        },
        error: () => {
          this.registerError = true;
          this.registerSuccess = false;
          setTimeout(() => this.registerError = false, 3000);
        }
      });
  }

  private obtenerFacturaNormal(pagoId: number): void {
    this.http.get<any>(`http://localhost:8082/api/factura/pago/${pagoId}`)
      .subscribe(factura => this.idFacturaGenerada = factura.id);
  }
}