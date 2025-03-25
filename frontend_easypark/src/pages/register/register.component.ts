import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  register = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl('')

});

constructor(private httpClient: HttpClient){}

  public handleSubmit() {
    console.log(this.register.value);
    this.httpClient.post('http://localhost:8082/addUser', this.register.value).subscribe((data:any) =>{
      alert("Registro exitoso")
    }, error=> {
      console.log(error);
    })
  }
}
