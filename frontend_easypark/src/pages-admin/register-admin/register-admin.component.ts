import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderAdminComponent, HttpClientModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {
  
  adminForm: FormGroup;
  registerSuccess = false;
  registerError = false;
  authorizedEmail = sessionStorage.getItem('adminEmail'); // Obtener email autenticado

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
