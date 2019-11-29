import { Routes, RouterModule } from '@angular/router';

import { BillingComponent } from './billing.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: BillingComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
