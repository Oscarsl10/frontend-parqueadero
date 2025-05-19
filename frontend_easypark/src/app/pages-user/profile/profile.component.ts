import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderUserComponent } from "../header-user/header-user.component";
import { AuthUserService } from '../services-user/auth-user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, HttpClientModule, RouterModule, HeaderUserComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = {};
  userForm: FormGroup;
  userEmail: string | null = null;
  isEditing = false;
  updateSuccess = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthUserService
  ) {
    this.userForm = this.fb.group({
      full_name: [''],
      email: [{ value: '', disabled: true }],
      telefono: [''],
      oldPassword: [''],
      newPassword: ['']
    });
  }

  ngOnInit() {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.userEmail = sessionStorage.getItem('userEmail');
    const userData = sessionStorage.getItem('userData');

    if (userData) {
      this.user = JSON.parse(userData);
    }

    if (!this.userEmail || this.userEmail === '') {
      this.errorMessage = "No se encontró sesión activa.";
      this.router.navigate(['/login']);
    } else {
      this.loadUserData(this.userEmail);
    }
  }

  loadUserData(email: string) {
    this.http.get(`http://localhost:8082/api/getUser/${email}`).subscribe(
      (data: any) => {
        console.log('Datos del usuario obtenidos:', data);
        this.userForm.patchValue({
          full_name: data.full_name,
          email: data.email || this.userEmail,
          telefono: data.telefono
        });
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
        this.errorMessage = 'Error al cargar la información.';
      }
    );
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadUserData(this.userEmail!);
  }

  saveChanges() {
    if (!this.userEmail) {
      console.error(" No hay email de usuario en sesión.");
      this.errorMessage = "No se encontró sesión activa.";
      return;
    }

    // ✅ Validar que Nombre y Teléfono no estén vacíos
    if (!this.userForm.value.full_name.trim() || !this.userForm.value.telefono.trim()) {
      this.errorMessage = "Los campos Nombre y Teléfono no pueden estar vacíos.";
      setTimeout(() => this.errorMessage = "", 3000);
      return;
    }

    const updatedData: any = {
      full_name: this.userForm.value.full_name,
      telefono: this.userForm.value.telefono
    };

    const newPassword = this.userForm.value.newPassword?.trim();
    const oldPassword = this.userForm.value.oldPassword?.trim();

    if (newPassword && oldPassword) {
      updatedData.oldPassword = oldPassword;
      updatedData.newPassword = newPassword;
    } else if (newPassword && !oldPassword) {
      this.errorMessage = "Debes ingresar tu contraseña actual para cambiarla.";
      return;
    }

    console.log("🚀 Datos enviados al backend:", JSON.stringify(updatedData));

    this.http.put(`http://localhost:8082/api/user/${this.userEmail}`, updatedData).subscribe(
      (response) => {
        console.log("Perfil actualizado con éxito:", response);
        this.updateSuccess = true;
        this.errorMessage = "";

        const userData = { ...JSON.parse(sessionStorage.getItem('userData') || '{}'), ...updatedData };
        sessionStorage.setItem('userData', JSON.stringify(userData));

        this.isEditing = false;
        setTimeout(() => this.updateSuccess = false, 1000);
      },
      (error) => {
        console.error("Error al actualizar perfil:", error);
        this.errorMessage = "Hubo un error al actualizar. Inténtalo de nuevo.";
      }
    );
  }


  logout() {
    sessionStorage.clear();
    this.authService.logout(); // Usa el servicio para cerrar sesión correctamente
    this.router.navigate(['/login']);
  }
}
