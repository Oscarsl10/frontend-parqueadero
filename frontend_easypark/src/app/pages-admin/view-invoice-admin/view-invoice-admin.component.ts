import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { AuthAdminService } from '../services-admin/auth-admin.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-view-invoice-admin',
  standalone: true,
  imports: [HeaderAdminComponent, CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './view-invoice-admin.component.html',
  styleUrls: ['./view-invoice-admin.component.css']
})
export class ViewInvoiceAdminComponent implements OnInit {
  facturas: any[] = [];
  facturasFiltradas: any[] = [];

  filtroPlaca = '';
  filtroTipoFactura: '' | 'normal' | 'reserva' = '';
  filtroFechaInicio = '';
  filtroFechaFin = '';
  filtroTipoVehiculo = '';
  filtroGeneral = '';

  tiposVehiculo: string[] = [];
  diaConMasVentas = '';
  mejorMes = '';
  peorMes = '';
  ordenAscendente = true;
  totalFiltrado = 0;

  constructor(private http: HttpClient, private authService: AuthAdminService) {}

  ngOnInit(): void {
    this.authService.requireLogin();

    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.filtroFechaInicio = primerDia.toISOString().split('T')[0];
    this.filtroFechaFin = ultimoDia.toISOString().split('T')[0];

    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.http.get<any[]>('http://localhost:8082/api/factura').subscribe(normales => {
      this.http.get<any[]>('http://localhost:8082/api/factura-reserva').subscribe(reservas => {
        this.facturas = [...normales, ...reservas];
        this.facturasFiltradas = [...this.facturas];
        this.extraerTipos();
        this.calcularEstadisticas();
        this.filtrar();
      });
    });
  }

  extraerTipos(): void {
    const tipos = this.facturas
      .map(f => this.obtenerTipoVehiculo(f))
      .filter((v, i, a) => v && a.indexOf(v) === i);
    this.tiposVehiculo = tipos;
  }

  filtrar(): void {
    this.facturasFiltradas = this.facturas.filter(f => {
      const placa = this.obtenerPlaca(f).toLowerCase();
      const tipoVeh = this.obtenerTipoVehiculo(f);
      const tipoFact = f.registroVehiculo ? 'normal' : 'reserva';
      const fecha = new Date(f.fechaEmision);

      const textoGeneral = this.filtroGeneral.toLowerCase();
      const coincideGeneral =
        !this.filtroGeneral ||
        placa.includes(textoGeneral) ||
        tipoVeh.toLowerCase().includes(textoGeneral) ||
        tipoFact.includes(textoGeneral) ||
        this.obtenerTarifa(f).toLowerCase().includes(textoGeneral) ||
        this.obtenerMetodoPago(f).toLowerCase().includes(textoGeneral);

      const okPlaca = !this.filtroPlaca || placa.includes(this.filtroPlaca.toLowerCase());
      const okTipoFact = !this.filtroTipoFactura || tipoFact === this.filtroTipoFactura;
      const okTipoVeh = !this.filtroTipoVehiculo || tipoVeh === this.filtroTipoVehiculo;
      const okDesde = !this.filtroFechaInicio || fecha >= new Date(this.filtroFechaInicio);
      const okHasta = !this.filtroFechaFin || fecha <= new Date(this.filtroFechaFin);

      return coincideGeneral && okPlaca && okTipoFact && okTipoVeh && okDesde && okHasta;
    });

    this.ordenarPorPlaca();
    this.calcularTotalFiltrado();
  }

  ordenarPorPlaca(): void {
    this.facturasFiltradas.sort((a, b) => {
      const placaA = this.obtenerPlaca(a).toLowerCase();
      const placaB = this.obtenerPlaca(b).toLowerCase();
      return this.ordenAscendente
        ? placaA.localeCompare(placaB)
        : placaB.localeCompare(placaA);
    });
  }

  calcularTotalFiltrado(): void {
    this.totalFiltrado = this.facturasFiltradas.reduce((sum, f) => sum + f.total, 0);
  }

  calcularEstadisticas(): void {
    const porDia: Record<string, number> = {};
    const porMes: Record<string, number> = {};

    this.facturas.forEach(f => {
      const d = new Date(f.fechaEmision);
      const dia = d.toISOString().split('T')[0];
      const mes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      porDia[dia] = (porDia[dia] || 0) + 1;
      porMes[mes] = (porMes[mes] || 0) + 1;
    });

    this.diaConMasVentas = this.maxKey(porDia);
    this.mejorMes = this.maxKey(porMes);
    this.peorMes = this.minKey(porMes);
  }

  // Helpers
  obtenerPlaca(f: any): string {
    return f.registroVehiculo?.placa || f.vehiculo?.placa || '';
  }

  obtenerTipoVehiculo(f: any): string {
    return f.registroVehiculo?.tipoVehiculo || f.vehiculo?.tipoVehiculo || '';
  }

  obtenerTarifa(f: any): string {
    const tarifaNormal = f.pago?.tarifa?.tipo_tarifa?.tipo_tarifa;
    const tarifaReserva = f.pagoReserva?.reserva?.tarifa?.tipo_tarifa?.tipo_tarifa;
    return tarifaNormal || tarifaReserva || 'N/A';
  }

  obtenerMetodoPago(f: any): string {
    return f.pago?.metodoPago || f.pagoReserva?.metodoPago || '';
  }

  maxKey(obj: Record<string, number>): string {
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  }

  minKey(obj: Record<string, number>): string {
    return Object.entries(obj).sort((a, b) => a[1] - b[1])[0]?.[0] || '';
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['N° Factura', 'Fecha', 'Tipo Factura', 'Placa', 'Tipo Vehículo', 'Tarifa', 'Método Pago', 'Total']],
      body: this.facturasFiltradas.map(f => [
        f.numeroFactura,
        new Date(f.fechaEmision).toLocaleDateString(),
        f.registroVehiculo ? 'Normal' : 'Reserva',
        this.obtenerPlaca(f),
        this.obtenerTipoVehiculo(f),
        this.obtenerTarifa(f),
        this.obtenerMetodoPago(f),
        `$${f.total.toLocaleString('es-CO')}`
      ]),
    });
    doc.save('facturas-filtradas.pdf');
  }

  toggleOrden(): void {
    this.ordenAscendente = !this.ordenAscendente;
    this.ordenarPorPlaca();
  }

  limpiarFiltros(): void {
    this.filtroGeneral = '';
    this.filtroPlaca = '';
    this.filtroTipoFactura = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroTipoVehiculo = '';
    this.filtrar();
  }
}