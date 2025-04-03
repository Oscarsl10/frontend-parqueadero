import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plans-admin',
  imports: [HeaderAdminComponent, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './plans-admin.component.html',
  styleUrls: ['./plans-admin.component.css']
})
export class PlansAdminComponent {

}
