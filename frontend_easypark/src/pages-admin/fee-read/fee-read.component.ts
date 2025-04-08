import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-fee-read',
  imports: [CommonModule, RouterModule, HeaderAdminComponent, HttpClientModule],
  templateUrl: './fee-read.component.html',
  styleUrl: './fee-read.component.css'
})
export class FeeReadComponent {
  tarifas: any[] = [];
  apiUrl = 'http://localhost:8082/api/tarifa';  // Aquí se define la URL de la API

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

ngOnInit() {
  this.cargarTarifas();
}

cargarTarifas() {
  this.http.get<any[]>(this.apiUrl).subscribe(
    (data) => {
      console.log('Datos recibidos desde la API:', data);  // Verifica qué datos estás recibiendo
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

  
}
