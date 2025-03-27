import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrige el plural aquí
})
export class LoginComponent {
  // Formulario reactivo para los datos del usuario
  data = new FormGroup({
    userId: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    
  });


  loginSuccess = false; // Estado de éxito del login
  loginError = false; // Estado de error del login

  constructor(private httpClient: HttpClient, private router: Router) {}

  public handleSubmit() {
    if (this.data.invalid) {
      this.data.markAllAsTouched(); // Marca todos los campos como tocados
      return;
    }

    console.log(this.data.value); // Datos enviados al backend

    this.httpClient.post('http://localhost:8082/loginUser', this.data.value).subscribe((response: any) => {
      console.log(response); // Respuesta del backend

      if (response === true) {
        this.loginSuccess = true;
        this.loginError = false;

        // Almacena el correo ingresado en sessionStorage
        const userEmail = this.data.get('userId')?.value; // Obtén el correo desde el formulario
        sessionStorage.setItem('userEmail', userEmail || ''); // Guarda el correo en sessionStorage

        // Redirige al componente Home después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/home']);
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
      this.loginError = true; // Manejo de error de servidor
      setTimeout(() => {
        this.loginError = false;
      }, 2000);
    });
  }
}
