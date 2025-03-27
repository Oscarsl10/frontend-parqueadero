import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  
  template: `<router-outlet></router-outlet>`,  
  providers: [] 
})
export class AppComponent {}
