import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { HeaderGeneralComponent } from '../../header-general/header-general.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, HeaderGeneralComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  register = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    full_name: new FormControl('', Validators.required),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{1,10}$/)
    ]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: this.passwordMatchValidator });
  
  registerSuccess = false;
  registerError = false;
  formInvalid = false; 
  emailTakenError = false;
  adminEmailError = false;

  constructor(private httpClient: HttpClient, private router: Router) {}
  
  
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  

  public handleSubmit() {
    if (this.register.invalid) {
      this.register.markAllAsTouched(); 
      this.formInvalid = true; 
      setTimeout(() => {
        this.formInvalid = false;
      }, 3000);
      return;
    }

    console.log(this.register.value);
    this.httpClient.post('http://localhost:8082/api/addUser', this.register.value).subscribe(
      (response: any) => {
        console.log(response);
        this.registerSuccess = true;
        this.registerError = false;
        this.adminEmailError = false;
        this.emailTakenError = false;
        this.formInvalid = false;

        setTimeout(() => {
          this.router.navigate(['/login']); 
        }, 2000);
      },
      (error) => {
        console.error(error);
        if (error.status === 409 && error.error) {
          switch (error.error) {
            case "ADMIN_EMAIL":
              this.adminEmailError = true;
              break;
            case "USER_EMAIL":
              this.emailTakenError = true;
              break;
          }
          setTimeout(() => {
            this.adminEmailError = false;
            this.emailTakenError = false;
          }, 5000);
        }
        this.registerError = true;
        setTimeout(() => {
          this.registerError = false;
        }, 3000);
      }
    );
  }
}
