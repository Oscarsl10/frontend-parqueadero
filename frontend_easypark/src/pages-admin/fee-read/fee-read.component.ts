import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-fee-read',
  imports: [CommonModule, RouterModule, HeaderAdminComponent, HttpClientModule],
  templateUrl: './fee-read.component.html',
  styleUrl: './fee-read.component.css'
})
export class FeeReadComponent {
  tarifas: any[] = [];
  apiUrl = 'http://localhost:8082/api/tarifa';  // Aquí se define la URL de la API

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private authService: AuthAdminService, private router: Router) {}

ngOnInit() {
  this.authService.requireLogin(); // Verifica si hay sesión activa
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
