import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pay-admin',
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pay-admin.component.html',
  styleUrls: ['./pay-admin.component.css']
})
export class PayAdminComponent implements OnInit{
  pagos: any[] = [];
  tarifas: any[] = [];
  newPago: any = {
    entrada: '',
    salida: '',
    vehiculo: {
      placa: '',
      tipoVehiculo: ''
    },
    tarifa: {
      precio: 0
    },
    valorPagar: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPagos();
    this.getTarifas();
  }

  getPagos() {
    this.http.get<any[]>('http://localhost:8082/pago').subscribe(data => {
      this.pagos = data;
    });
  }

  getTarifas() {
    this.http.get<any[]>('http://localhost:8082/tarifa').subscribe(data => {
      this.tarifas = data;
    });
  }

  updateTarifa() {
    const tarifaSeleccionada = this.tarifas.find(t => t.tipoVehiculo === this.newPago.vehiculo.tipoVehiculo);
    if (tarifaSeleccionada) {
      this.newPago.tarifa.precio = tarifaSeleccionada.precio;
    } else {
      this.newPago.tarifa.precio = 0;
    }
  }

  calcularPago() {
    if (!this.newPago.entrada || !this.newPago.salida) return;
    
    const entrada = new Date(this.newPago.entrada).getTime();
    const salida = new Date(this.newPago.salida).getTime();
    
    if (salida > entrada) {
      const horas = (salida - entrada) / (1000 * 60 * 60); // Convertir ms a horas
      this.newPago.valorPagar = horas * this.newPago.tarifa.precio;
    } else {
      this.newPago.valorPagar = 0;
    }
  }

  addPago() {
    this.http.post('http://localhost:8082/pago', this.newPago).subscribe(() => {
      this.getPagos();
      this.newPago = {
        entrada: '',
        salida: '',
        vehiculo: { placa: '', tipoVehiculo: '' },
        tarifa: { precio: 0 },
        valorPagar: 0
      };
    });
  }

  deletePago(id: number) {
    this.http.delete(`http://localhost:8082/pago/${id}`).subscribe(() => {
      this.getPagos();
    });
  }
}
