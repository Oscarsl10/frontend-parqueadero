import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { AuthAdminService } from '../services-admin/auth-admin.service';
import { catchError, map } from 'rxjs/operators';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-invoice-admin',
  imports: [CommonModule, RouterModule, HttpClientModule, HeaderAdminComponent],
  templateUrl: './invoice-admin.component.html',
  styleUrl: './invoice-admin.component.css'
})
export class InvoiceAdminComponent implements OnInit {
  factura: any;
  tipo: 'normal' | 'reserva' | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.requireLogin();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return this.volverAlPay();

    // 1) Intentar cargar factura normal
    this.http.get<any>(`http://localhost:8082/api/factura/${id}`)
      .pipe(
        map(f => {
          // Si no tiene registroVehiculo, no es factura normal
          if (!f.registroVehiculo) {
            throw new Error('No es factura normal');
          }
          return f;
        }),
        catchError(() => {
          // 2) Intentar factura-reserva
          return this.http.get<any>(`http://localhost:8082/api/factura-reserva/${id}`)
            .pipe(
              map(fr => {
                if (!fr.pagoReserva) {
                  throw new Error('Tampoco es factura-reserva');
                }
                return fr;
              })
            );
        })
      )
      .subscribe({
        next: data => {
          // 3) Determinar tipo según propiedades
          this.factura = data;
          this.tipo = data.registroVehiculo ? 'normal' : 'reserva';
          this.cargando = false;
        },
        error: () => {
          alert('Factura no encontrada.');
          this.volverAlPay();
        }
      });
  }

  private volverAlPay() {
    this.router.navigate(['/admin/pay']);
  }

  exportarPDF(): void {
    import('html2pdf.js').then(html2pdf => {
      const element = document.getElementById('factura');
      if (!element) return console.error('Elemento #factura no encontrado');
      const opciones = {
        margin: [0.2, 0.3, 0.2, 0.3],
        filename: 'factura.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: [80, 297], orientation: 'portrait' }
      };
      html2pdf.default().from(element).set(opciones).save();
    });
  }
}