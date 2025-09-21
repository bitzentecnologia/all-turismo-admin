import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { CuponsComponent } from './features/dashboard/cupons/cupons.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { RegisterSuccessComponent } from './features/auth/register-success/register-success.component';

import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'registrar',
    component: RegisterComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'registro-sucesso',
    component: RegisterSuccessComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'cupons',
        component: CuponsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
