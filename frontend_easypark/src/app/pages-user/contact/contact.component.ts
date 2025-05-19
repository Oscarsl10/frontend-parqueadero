import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderUserComponent } from "../header-user/header-user.component";
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderUserComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
nombre: string = '';
  correo: string = '';
  asunto: string = '';
  mensaje: string = '';

  successAlert = false;
  errorAlert = false;
  warningAlert = false;

  constructor(private http: HttpClient, private authService: AuthUserService) {}

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
  }

  enviar() {
    if (!this.nombre || !this.correo || !this.asunto || !this.mensaje) {
      this.warningAlert = true;
      setTimeout(() => this.warningAlert = false, 2000);
      return;
    }

    const soporte = {
      nombre: this.nombre,
      correo: this.correo,
      asunto: this.asunto,
      mensaje: this.mensaje
    };

    this.http.post('http://localhost:8082/api/soporte/enviar', soporte)
      .subscribe({
        next: () => {
          this.successAlert = true;
          this.nombre = '';
          this.correo = '';
          this.asunto = '';
          this.mensaje = '';
          setTimeout(() => this.successAlert = false, 2000);
        },
        error: () => {
          this.errorAlert = true;
          setTimeout(() => this.errorAlert = false, 2000);
        }
      });
  }
}
