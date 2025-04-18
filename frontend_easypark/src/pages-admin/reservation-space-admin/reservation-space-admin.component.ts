import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { Router, RouterModule } from '@angular/router';
import { AuthAdminService } from '../services-admin/auth-admin.service';

@Component({
  selector: 'app-reservation-space-admin',
  imports: [CommonModule, HeaderAdminComponent, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reservation-space-admin.component.html',
  styleUrl: './reservation-space-admin.component.css'
})
export class ReservationSpaceAdminComponent implements OnInit {
  espacioForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  espacios: any[] = [];
  espacioId: number | null = null; // Variable para almacenar el ID del espacio cuando se edita

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthAdminService) {
    this.espacioForm = this.fb.group({
      espacio_total: ['', [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]] // Campo descripción agregado
    });
  }

  irAVerReserva() {
    this.router.navigate(['admin/booking']);
  }

  ngOnInit(): void {
    this.authService.requireLogin(); // Verifica si hay sesión activa
    this.obtenerEspacios(); // Obtener los espacios al cargar el componente
  }

  obtenerEspacios() {
    this.http.get<any[]>('http://localhost:8082/api/espacio_total').subscribe(
      data => {
        this.espacios = data;
      },
      error => {
        console.error('Error al cargar los espacios:', error);
      }
    );
  }

  onSubmit() {
    if (this.espacioForm.valid) {
      const formValue = this.espacioForm.value;
      const datos = {
        espacio_total: formValue.espacio_total,
        descripcion: formValue.descripcion
      };

      if (this.espacioId === null) {
        // Crear un nuevo espacio
        this.http.post('http://localhost:8082/api/espacio_total', datos).subscribe({
          next: () => {
            this.mensaje = 'Espacio total registrado correctamente.';
            this.error = '';
            this.obtenerEspacios(); // Recargar los espacios
            this.espacioForm.reset();
          },
          error: (err) => {
            console.error('Error al registrar espacio:', err);
            this.mensaje = '';
            this.error = 'Error al registrar espacio.';
          }
        });
      } else {
        // Editar el espacio existente
        this.http.put(`http://localhost:8082/api/espacio_total/${this.espacioId}`, datos).subscribe({
          next: () => {
            this.mensaje = 'Espacio actualizado correctamente.';
            this.error = '';
            this.obtenerEspacios(); // Recargar los espacios
            this.espacioForm.reset();
            this.espacioId = null; // Restablecer espacioId después de la edición
          },
          error: (err) => {
            console.error('Error al actualizar espacio:', err);
            this.mensaje = '';
            this.error = 'Error al actualizar espacio.';
          }
        });
      }
    }
  }

  // Editar el espacio
  editarEspacio(espacio: any) {
    this.espacioForm.setValue({
      espacio_total: espacio.espacio_total,
      descripcion: espacio.descripcion // Agregar descripción al formulario
    });
    this.espacioId = espacio.id; // Guardamos el ID para realizar la actualización
  }

  // Eliminar el espacio
  eliminarEspacio(id: number) {
    this.http.delete(`http://localhost:8082/api/espacio_total/${id}`).subscribe({
      next: () => {
        this.mensaje = 'Espacio eliminado correctamente.';
        this.obtenerEspacios(); // Recargar los espacios
      },
      error: (err) => {
        console.error('Error al eliminar espacio:', err);
        this.error = 'Error al eliminar espacio.';
      }
    });
  }
}