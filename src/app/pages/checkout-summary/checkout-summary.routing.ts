import { Routes, RouterModule } from '@angular/router';

import { CheckoutSummaryComponent } from './checkout-summary.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
{
  path: '',
  component: CheckoutSummaryComponent,
},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
