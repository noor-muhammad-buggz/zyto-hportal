import { Routes, RouterModule } from '@angular/router';

import { CheckoutCartComponent } from './checkout-cart.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
{
  path: '',
  component: CheckoutCartComponent,
},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
