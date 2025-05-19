import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { Router } from '@angular/router';
import { AuthUserGuard } from '../guards-user/auth-user.guard';
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  selector: 'app-qualification',
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderUserComponent],
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit{
  calificacion: string;  // Ahora es un string
  comentario: string;
  successAlert: boolean = false;
  errorAlert: boolean = false;
  validationError: boolean = false;  // Para mostrar el error si faltan campos


  constructor(private http: HttpClient, private router: Router, private authService: AuthUserService) { }
  
  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
  }

  // Función para enviar la calificación al backend
   enviarCalificacion() {
    // Verificar si los campos están vacíos
    if (!this.calificacion || !this.comentario) {
      this.validationError = true;  // Mostrar error de validación
      setTimeout(() => { this.validationError = false; }, 3000); // El error desaparece después de 3 segundos
      return;
    }

    // Validación de calificación
    if (!['1', '2', '3', '4', '5'].includes(this.calificacion)) {
      this.errorAlert = true;
      setTimeout(() => { this.errorAlert = false; }, 3000);
      return;
    }

    const email = sessionStorage.getItem('userEmail'); // Obtener email del sessionStorage

    if (!email) {
      this.errorAlert = true;
      setTimeout(() => { this.errorAlert = false; }, 3000);
      return;
    }

    // Crear el objeto de calificación
    const calificacionData = {
      calificacion: this.calificacion,
      comentario: this.comentario,
      users: {
        email: sessionStorage.getItem('userEmail')  // Enviamos el email del usuario que está logueado
      }
    };

    // Enviar la calificación al backend
    this.http.post('http://localhost:8082/api/calificacion', calificacionData)
      .subscribe(
        (response) => {
          this.successAlert = true;
          setTimeout(() => { this.successAlert = false; }, 3000);
        },
        (error) => {
          this.errorAlert = true;
          setTimeout(() => { this.errorAlert = false; }, 3000);
        }
      );
  }
}
