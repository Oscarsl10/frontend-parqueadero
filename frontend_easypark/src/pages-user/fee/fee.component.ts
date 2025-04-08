import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderUserComponent } from "../header-user/header-user.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fee',
  imports: [CommonModule, RouterModule, HeaderUserComponent, HttpClientModule],
  templateUrl: './fee.component.html',
  styleUrl: './fee.component.css'
})
export class FeeComponent {
  tarifas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8082/api/tarifa').subscribe(data => {
      this.tarifas = data;
    });
  }

  getTarifasPorTipo(tipo: string): any[] {
    return this.tarifas.filter(t => t.tipoVehiculo === tipo);
  }
}
