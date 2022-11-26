import { ENVIRONMENT_INITIALIZER, inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginService } from './login/login.service';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((module) => module.LoginComponent),
    canLoad: [],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (module) => module.DashboardComponent
      ),
    canActivate: [AuthGuard],
    providers: [
      {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useValue() {
          inject(LoginService).initRefresh();
        },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
