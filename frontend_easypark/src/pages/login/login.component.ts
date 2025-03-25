import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
 data = new FormGroup({
    userId: new FormControl(''),
    password: new FormControl('')

});

constructor(private httpClient: HttpClient){}

  public handleSubmit() {
    console.log(this.data.value);
    this.httpClient.post('http://localhost:8082/loginUser', this.data.value).subscribe((data:any) =>{
      console.log(data);
      if(data == true){
        alert("Inicio de sesión exitoso");
      }
      else {
        alert("Correo o contraseña incorrectos, por favor ingrese nuevamente sus datos");
      }
    })
  }

}
