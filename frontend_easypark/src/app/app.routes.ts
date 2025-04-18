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
import { FeeReadComponent } from '../pages-admin/fee-read/fee-read.component';
import { FeeComponent } from '../pages-user/fee/fee.component';
import { HeaderAdminComponent } from '../pages-admin/header-admin/header-admin.component';
import { InvoiceAdminComponent } from '../pages-admin/invoice-admin/invoice-admin.component';
import { ViewInvoiceAdminComponent } from '../pages-admin/view-invoice-admin/view-invoice-admin.component';
import { BookingComponent } from '../pages-user/booking/booking.component';
import { VehiculeComponent } from '../pages-user/vehicule/vehicule.component';
import { ReservationSpaceAdminComponent } from '../pages-admin/reservation-space-admin/reservation-space-admin.component';
import { BookingAdminComponent } from '../pages-admin/booking-admin/booking-admin.component';
import { AuthAdminGuard } from '../pages-admin/guards-admin/auth-admin.guard';
import { AuthUserGuard } from '../pages-user/guards-user/auth-user.guard';
import { WelcomeComponent } from '../welcome/welcome.component';
import { PlansComponent } from '../pages-user/plans/plans.component';


export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/home', component: HomeAdminComponent },
  { path: 'admin/register', component: RegisterAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/profile', component: ProfileAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/dashboard', component: DashboardAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/plans', component: PlansAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/fee', component: FeeAdminComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/pay', component: PayAdminComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/vehicule', component: VehiculeAdminComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/feeread', component: FeeReadComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/invoice/:id', component: InvoiceAdminComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/view_invoice', component: ViewInvoiceAdminComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/reservation', component: ReservationSpaceAdminComponent, canActivate: [AuthAdminGuard]},
  { path: 'admin/booking', component: BookingAdminComponent, canActivate: [AuthAdminGuard]},

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthUserGuard]},
  { path: 'recuperar', component: RecuperarPasswordUComponent },
  { path: 'fee', component: FeeComponent},
  { path: 'user/booking', component: BookingComponent, canActivate: [AuthUserGuard]},
  { path: 'user/vehicule', component: VehiculeComponent, canActivate: [AuthUserGuard]},
  { path: 'user/plans', component: PlansComponent, canActivate: [AuthUserGuard]},
  
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
