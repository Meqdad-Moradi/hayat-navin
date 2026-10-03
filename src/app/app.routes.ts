import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Home } from './components/pages/home/home';
import { userGuard } from './guards/user-guard';
import { Register } from './components/pages/register/register';
import { Login } from './components/pages/login/login';
import { NotFound } from './components/pages/not-found/not-found';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    data: {
      roles: ['admin', 'editor', 'viewer'], // نقش‌های مجاز برای دسترسی به این مسیر
    },
    children: [{ path: '', component: Home, pathMatch: 'full' }],
  },
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: '**', component: NotFound, pathMatch: 'full' },
];
