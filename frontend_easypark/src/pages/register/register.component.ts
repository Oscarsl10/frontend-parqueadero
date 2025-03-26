import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent {
  register = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerSuccess = false;
  registerError = false;
  formInvalid = false; 

  constructor(private httpClient: HttpClient, private router: Router) {}

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
    this.httpClient.post('http://localhost:8082/addUser', this.register.value).subscribe(
      (response: any) => {
        console.log(response);
        this.registerSuccess = true;
        this.registerError = false;
        this.formInvalid = false;

        setTimeout(() => {
          this.router.navigate(['/login']); 
        }, 2000);
      },
      (error) => {
        console.error(error);
        this.registerError = true;
        this.registerSuccess = false;

        setTimeout(() => {
          this.registerError = false;
        }, 3000);
      }
    );
  }
}
