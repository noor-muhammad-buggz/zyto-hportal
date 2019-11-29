import { Routes, RouterModule } from '@angular/router';

import { OrderDetailComponent } from './order-detail.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
{
  path: '',
  component: OrderDetailComponent,
},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
