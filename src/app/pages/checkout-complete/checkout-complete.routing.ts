import { Routes, RouterModule } from '@angular/router';

import { CheckoutCompleteComponent } from './checkout-complete.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
{
  path: '',
  component: CheckoutCompleteComponent,
},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
