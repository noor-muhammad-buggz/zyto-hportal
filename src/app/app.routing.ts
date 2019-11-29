import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Auth0CallbackComponent } from './components/auth0-callback/auth0-callback.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'introduction',
    loadChildren: 'app/pages/introduction/introduction.module#IntroductionModule',
  },
  {
    path: 'callback',
    component: Auth0CallbackComponent,
    //pathMatch: 'full'
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'pages/dashboard', canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
