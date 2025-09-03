import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { CuponsComponent } from './features/dashboard/cupons/cupons.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'cupons',
        component: CuponsComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
