import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  dataAdmin = new FormGroup({
    userId: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  loginSuccess = false; // Estado de éxito del login
  loginError = false; // Estado de error del login

  constructor(private httpClient: HttpClient, private router: Router) {}

  emailTakenError = false; // Nueva variable para mostrar la alerta de correo en uso

  public handleSubmit() {
    if (this.dataAdmin.invalid) {
      this.dataAdmin.markAllAsTouched(); // Marca todos los campos como tocados
      return;
    }

    console.log(this.dataAdmin.value); // Datos enviados al backend

    this.httpClient.post('http://localhost:8082/loginAdmin', this.dataAdmin.value).subscribe((response: any) => {
      console.log(response); // Respuesta del backend

      if (response === true) {
        this.loginSuccess = true;
        this.loginError = false;

        // Almacena el correo ingresado en sessionStorage
        const adminEmail = this.dataAdmin.get('userId')?.value; // Obtén el correo desde el formulario
        sessionStorage.setItem('adminEmail', adminEmail || ''); // Guarda el correo en sessionStorage

        // Redirige al componente Home después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/admin/home']);
        }, 1000);
      } else {
        // Manejo de error si las credenciales no son válidas
        this.loginError = true;
        this.loginSuccess = false;

        setTimeout(() => {
          this.loginError = false;
        }, 2000);
      }
    }, (error) => {
      console.error('Error en la solicitud:', error);
      if (error.status === 400){
        this.emailTakenError = true; // Activa la alerta en el HTML
    setTimeout(() => {
      this.emailTakenError = false;
    }, 3000);
      }
      this.loginError = true; // Manejo de error de servidor
      setTimeout(() => {
        this.loginError = false;
      }, 2000);
    });
  }
}
