import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-general',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-general.component.html',
  styleUrls: ['./header-general.component.css']
})
export class HeaderGeneralComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
