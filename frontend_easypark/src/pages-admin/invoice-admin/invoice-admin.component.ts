import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';

@Component({
  selector: 'app-invoice-admin',
  imports: [CommonModule, RouterModule, HttpClientModule, HeaderAdminComponent],
  templateUrl: './invoice-admin.component.html',
  styleUrl: './invoice-admin.component.css'
})
export class InvoiceAdminComponent implements OnInit {
  factura: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const pagoId = this.route.snapshot.paramMap.get('id');
    if (pagoId) {
      this.http.get(`http://localhost:8082/api/factura/pago/${pagoId}`)
        .subscribe(data => {
          this.factura = data;
        });
    }
  }

}
