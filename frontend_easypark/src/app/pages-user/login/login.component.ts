import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderGeneralComponent } from '../../header-general/header-general.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, HeaderGeneralComponent],
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
      this.data.markAllAsTouched();
      return;
    }
  
    this.httpClient.post('http://localhost:8082/api/loginUser', this.data.value).subscribe(
      (response: any) => {
        console.log(response); // 🔹 Ahora `response` es un objeto con los datos del usuario
  
        if (response === true) {
          sessionStorage.setItem('userEmail', this.data.get('userId')?.value || '');
          setTimeout(() => {
            this.router.navigate(['user/home']);
          }, 1000);
        } else {
          this.loginError = true;
          setTimeout(() => {
            this.loginError = false;
          }, 2000);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        this.loginError = true;
        setTimeout(() => {
          this.loginError = false;
        }, 2000);
      }
    );
  }
}
