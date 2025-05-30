import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-register-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderAdminComponent, HttpClientModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent implements OnInit {

  adminForm: FormGroup;
  registerSuccess = false;
  registerError = false;
  authorizedEmail = sessionStorage.getItem('adminEmail'); // Obtener email autenticado

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthAdminService) {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', Validators.required]
    });
    // Mostrar cambios en el formulario
    this.adminForm.statusChanges.subscribe(status => {
      console.log("Estado del formulario:", status);
      console.log("Errores:", this.adminForm.errors);
    });
  }

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
  }

  registerAdmin() {
    console.log("Intentando registrar administrador...");
    if (this.adminForm.valid) {
      this.http.post(`http://localhost:8082/api/addAdmin?authorizedEmail=${this.authorizedEmail}`, this.adminForm.value)
        .subscribe({
          next: () => {
            this.registerSuccess = true;
            this.registerError = false;
            this.adminForm.reset();
          },
          error: (error) => {
            this.registerError = true;
            console.error('Error al registrar:', error);
          }
        });
    }
  }

}
