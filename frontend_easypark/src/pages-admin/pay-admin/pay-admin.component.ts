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
  placa: string = '';
  salida: string = '';
  entrada: string = '';
  tipoVehiculo: string = '';
  tarifa: any = null;
  vehiculoId: number | null = null;
  valorAPagar: number = 0;

  vehiculoEncontrado: boolean = false;
  registerSuccess: boolean = false;
  registerError: boolean = false;

  idFacturaGenerada: number | null = null;

  constructor(private http: HttpClient, private authService: AuthAdminService, private router: Router ) { }

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
   }

  buscarVehiculo() {
    this.http.get<any[]>('http://localhost:8082/api/registroVehiculo')
      .subscribe(data => {
        const vehiculo = data.find(v => v.placa.toLowerCase() === this.placa.toLowerCase());
        if (vehiculo) {
          this.vehiculoId = vehiculo.id;
          this.entrada = vehiculo.entrada;
          this.tipoVehiculo = vehiculo.tipoVehiculo;
          this.tarifa = vehiculo.tarifa; // 👈 asegúrate de que se asigna bien
          this.vehiculoEncontrado = true;
        } else {
          this.vehiculoEncontrado = false;
          alert("Vehículo no encontrado.");
        }
      });
  }

  registrarPago() {
    if (!this.vehiculoId || !this.salida) {
      this.registerError = true;
      return;
    }

    const entradaDate = new Date(this.entrada);
    const salidaDate = new Date(this.salida);

    const diffInMs = salidaDate.getTime() - entradaDate.getTime();
    const totalMinutes = diffInMs / (1000 * 60);
    const totalHours = totalMinutes / 60;
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const remainingMinutes = totalMinutes % 60;

    let pagar = totalDays * this.tarifa.precio * 24;

    if (remainingHours > 0 || remainingMinutes > 0) {
      let horasFinales = remainingHours;
      if (remainingMinutes > 30) horasFinales += 1;
      else if (remainingMinutes > 0) horasFinales += 0.5;
      pagar += horasFinales * this.tarifa.precio;
    }

    this.valorAPagar = pagar;

    const datosPago = {
      salida: this.salida,
      valorAPagar: this.valorAPagar,
      registroVehiculo: { id: this.vehiculoId },
      tarifa: { id: this.tarifa.id }
    };

    this.http.post<any>('http://localhost:8082/api/pago', datosPago)
      .subscribe(
        (pago) => {
          this.registerSuccess = true;
          this.registerError = false;

          const pagoId = pago.id;

          // Llamar la factura asociada
          this.http.get<any>(`http://localhost:8082/api/factura/pago/${pagoId}`)
            .subscribe(factura => {
              console.log('Factura generada:', factura);
              this.idFacturaGenerada = factura.id;
              // aquí puedes redirigir o guardar la factura para mostrarla
              // por ejemplo, navegar a una vista de factura
              // this.router.navigate(['/factura', factura.id]);
            });

          setTimeout(() => this.registerSuccess = false, 3000);
        },
        () => {
          this.registerError = true;
          this.registerSuccess = false;
          setTimeout(() => this.registerError = false, 3000);
        }
      );
  }
}
