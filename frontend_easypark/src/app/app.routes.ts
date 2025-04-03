import { Routes } from '@angular/router';
import { HomeComponent } from '../pages-user/home/home.component';
import { LoginComponent } from '../pages-user/login/login.component';
import { RegisterComponent } from '../pages-user/register/register.component';
import { LoginAdminComponent } from '../pages-admin/login-admin/login-admin.component';
import { HomeAdminComponent } from '../pages-admin/home-admin/home-admin.component';
import { ProfileAdminComponent } from '../pages-admin/profile-admin/profile-admin.component';
import { ProfileComponent } from '../pages-user/profile/profile.component';
import { RecuperarPasswordUComponent } from '../pages-user/recuperar-password-u/recuperar-password-u.component';
import { DashboardAdminComponent } from '../pages-admin/dashboard-admin/dashboard-admin.component';
import { PlansAdminComponent } from '../pages-admin/plans-admin/plans-admin.component';
import { RegisterAdminComponent } from '../pages-admin/register-admin/register-admin.component';
import { FeeAdminComponent } from '../pages-admin/fee-admin/fee-admin.component';
import { PayAdminComponent } from '../pages-admin/pay-admin/pay-admin.component';
import { VehiculeAdminComponent } from '../pages-admin/vehicule-admin/vehicule-admin.component';




export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/home', component: HomeAdminComponent },
  { path: 'user/home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin/profile', component: ProfileAdminComponent },
  { path: 'admin/home', component: HomeAdminComponent },
  { path: 'recuperar', component: RecuperarPasswordUComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'admin/plans', component: PlansAdminComponent },
  { path: 'admin/register', component: RegisterAdminComponent },
  { path: 'admin/fee', component: FeeAdminComponent},
  { path: 'admin/pay', component: PayAdminComponent},
  { path: 'admin/vehicule', component: VehiculeAdminComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
