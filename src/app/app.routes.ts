import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Register } from './components/pages/register/register';
import { Login } from './components/pages/login/login';
import { NotFound } from './components/pages/not-found/not-found';
import { authGuard } from './guards/auth-guard';
import { Sidenav } from './components/navigations/sidenav/sidenav';
import { userGuard } from './guards/user-guard';
import { environment } from './environments/environment';
import { SearchStudents } from './components/pages/search-students/search-students';
import { Profile } from './components/pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Sidenav,
        children: [
          {
            path: environment.apps.profile.route,
            component: Profile,
            data: ['admin'],
            canActivate: [userGuard],
            pathMatch: 'full',
          },
          {
            path: environment.apps.searchstudents.route,
            component: SearchStudents,
            data: ['admin', 'studen'],
            canActivate: [userGuard],
            pathMatch: 'full',
          },
          {
            path: environment.apps.registration.route,
            component: Register,
            data: ['admin'],
            canActivate: [userGuard],
            pathMatch: 'full',
          },
        ],
      },
      // {
      //   path: 'admin-panel',
      //   canActivate: [userGuard], // 👈 لایه دوم: حالا نقش کاربر را چک کن
      //   data: { roles: ['ADMIN'] }, // 👈 ارسال دیتای داینامیک به گارد
      //   loadComponent: () => import('./admin/admin.component'),
      // },
    ],
  },
  { path: 'login', component: Login, pathMatch: 'full' },
  { path: '**', component: NotFound, pathMatch: 'full' },
];
