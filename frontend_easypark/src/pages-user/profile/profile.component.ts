import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, HttpClientModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {      
  user: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = sessionStorage.getItem('userEmail'); // Obtiene el email del usuario

    if (email) {
      this.http.get<any>(`http://localhost:8082/getUser/${email}`).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error al obtener el usuario', error);
        }
      );
    } else {
      console.error("No hay email en sessionStorage");
    }
  }    

  logout() {
    sessionStorage.clear(); // Borra la sesión del usuario
    this.router.navigate(['/home']); // Redirige al home
  }
}
