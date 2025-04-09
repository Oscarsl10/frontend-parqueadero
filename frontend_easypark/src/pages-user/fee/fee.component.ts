import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderUserComponent } from "../header-user/header-user.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fee',
  imports: [CommonModule, RouterModule, HttpClientModule, HeaderUserComponent],
  templateUrl: './fee.component.html',
  styleUrl: './fee.component.css'
})
export class FeeComponent {
  tarifas: any[] = [];
  apiUrl = 'http://localhost:8082/api/tarifa';  // Aquí se define la URL de la API

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

ngOnInit() {
  this.cargarTarifas();
}

cargarTarifas() {
  this.http.get<any[]>(this.apiUrl).subscribe(
    (data) => {
      console.log('Datos recibidos desde la API:', data);

      // Ordena alfabéticamente por tipo de vehículo
      this.tarifas = data.sort((a, b) => {
        const tipoA = a.tipoVehiculo?.tipo_vehiculo?.toLowerCase() || '';
        const tipoB = b.tipoVehiculo?.tipo_vehiculo?.toLowerCase() || '';
        return tipoA.localeCompare(tipoB);
      });

      // Si estás usando ChangeDetectorRef para actualizar manualmente
      this.cdRef.detectChanges();
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
