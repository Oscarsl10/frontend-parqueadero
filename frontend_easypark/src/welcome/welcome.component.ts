import { Component } from '@angular/core';
import { HeaderGeneralComponent } from "../header-general/header-general.component";

@Component({
  selector: 'app-welcome',
  imports: [HeaderGeneralComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
