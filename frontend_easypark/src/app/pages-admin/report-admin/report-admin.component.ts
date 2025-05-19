import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-report-admin',
  imports: [CommonModule, HeaderAdminComponent, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report-admin.component.html',
  styleUrl: './report-admin.component.css'
})
export class ReportAdminComponent implements OnInit {

  reportes: any[] = [];
  reporte: any = {
    autor: '',
    mensaje: ''
  };
  editMode: boolean = false;

  private apiUrl = 'http://localhost:8082/api/reporte';

  constructor(private http: HttpClient, private authService: AuthAdminService) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.getReportes();
  }

  getReportes(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.reportes = data;
    });
  }

  guardar(): void {
    if (this.editMode) {
      this.http.put(`${this.apiUrl}/${this.reporte.id}`, this.reporte).subscribe(() => {
        this.resetFormulario();
        this.getReportes();
      });
    } else {
      this.http.post(this.apiUrl, this.reporte).subscribe(() => {
        this.resetFormulario();
        this.getReportes();
      });
    }
  }

  editar(reporte: any): void {
    this.reporte = { ...reporte };
    this.editMode = true;
  }

  eliminar(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.getReportes();
    });
  }

  resetFormulario(): void {
    this.reporte = {
      autor: '',
      mensaje: ''
    };
    this.editMode = false;
  }
}
