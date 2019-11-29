import { Routes, RouterModule } from '@angular/router';

import { PlanComponent } from './plan.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: PlanComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
