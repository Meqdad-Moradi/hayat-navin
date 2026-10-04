import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Register } from './components/pages/register/register';
import { Login } from './components/pages/login/login';
import { NotFound } from './components/pages/not-found/not-found';
import { authGuard } from './guards/auth-guard';
import { Sidenav } from './components/navigations/sidenav/sidenav';
import { userGuard } from './guards/user-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Sidenav, pathMatch: 'full' },
      // {
      //   path: 'admin-panel',
      //   canActivate: [userGuard], // 👈 لایه دوم: حالا نقش کاربر را چک کن
      //   data: { roles: ['ADMIN'] }, // 👈 ارسال دیتای داینامیک به گارد
      //   loadComponent: () => import('./admin/admin.component'),
      // },
    ],
  },
  { path: 'register', component: Register, pathMatch: 'full' },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: '**', component: NotFound, pathMatch: 'full' },
];
