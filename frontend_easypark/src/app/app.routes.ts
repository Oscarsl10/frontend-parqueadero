import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { BookingAdminComponent } from './pages-admin/booking-admin/booking-admin.component';
import { DashboardAdminComponent } from './pages-admin/dashboard-admin/dashboard-admin.component';
import { FeeAdminComponent } from './pages-admin/fee-admin/fee-admin.component';
import { FeeReadComponent } from './pages-admin/fee-read/fee-read.component';
import { AuthAdminGuard } from './pages-admin/guards-admin/auth-admin.guard';
import { HomeAdminComponent } from './pages-admin/home-admin/home-admin.component';
import { InvoiceAdminComponent } from './pages-admin/invoice-admin/invoice-admin.component';
import { LoginAdminComponent } from './pages-admin/login-admin/login-admin.component';
import { PayAdminComponent } from './pages-admin/pay-admin/pay-admin.component';
import { ProfileAdminComponent } from './pages-admin/profile-admin/profile-admin.component';
import { QualificationAdminComponent } from './pages-admin/qualification-admin/qualification-admin.component';
import { RegisterAdminComponent } from './pages-admin/register-admin/register-admin.component';
import { ReportAdminComponent } from './pages-admin/report-admin/report-admin.component';
import { ReservationSpaceAdminComponent } from './pages-admin/reservation-space-admin/reservation-space-admin.component';
import { VehiculeAdminComponent } from './pages-admin/vehicule-admin/vehicule-admin.component';
import { ViewInvoiceAdminComponent } from './pages-admin/view-invoice-admin/view-invoice-admin.component';
import { BookingComponent } from './pages-user/booking/booking.component';
import { ContactComponent } from './pages-user/contact/contact.component';
import { FeeComponent } from './pages-user/fee/fee.component';
import { AuthUserGuard } from './pages-user/guards-user/auth-user.guard';
import { HomeComponent } from './pages-user/home/home.component';
import { LoginComponent } from './pages-user/login/login.component';
import { ProfileComponent } from './pages-user/profile/profile.component';
import { QualificationComponent } from './pages-user/qualification/qualification.component';
import { RecuperarPasswordUComponent } from './pages-user/recuperar-password-u/recuperar-password-u.component';
import { RegisterComponent } from './pages-user/register/register.component';
import { ReservationHistoryComponent } from './pages-user/reservation-history/reservation-history.component';
import { VehiculeComponent } from './pages-user/vehicule/vehicule.component';
import { FeaturesComponent } from './features/features.component';



export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/home', component: HomeAdminComponent },
  { path: 'admin/register', component: RegisterAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/profile', component: ProfileAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/dashboard', component: DashboardAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/fee', component: FeeAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/pay', component: PayAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/vehicule', component: VehiculeAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/feeread', component: FeeReadComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/invoice/:id', component: InvoiceAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/view_invoice', component: ViewInvoiceAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/reservation', component: ReservationSpaceAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/booking', component: BookingAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/qualification', component: QualificationAdminComponent, canActivate: [AuthAdminGuard] },
  { path: 'admin/report', component: ReportAdminComponent, canActivate: [AuthAdminGuard] },


  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/home', component: HomeComponent, canActivate: [AuthUserGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthUserGuard] },
  { path: 'recuperar', component: RecuperarPasswordUComponent },
  { path: 'fee', component: FeeComponent },
  { path: 'user/booking', component: BookingComponent, canActivate: [AuthUserGuard] },
  { path: 'user/vehicule', component: VehiculeComponent, canActivate: [AuthUserGuard] },
  { path: 'user/contact', component: ContactComponent, canActivate: [AuthUserGuard] },
  { path: 'user/qualification', component: QualificationComponent, canActivate: [AuthUserGuard]  },
  { path: 'user/history', component: ReservationHistoryComponent, canActivate: [AuthUserGuard]  },


  { path: 'features', component: FeaturesComponent },




  { path: '**', redirectTo: '', pathMatch: 'full' }
];
