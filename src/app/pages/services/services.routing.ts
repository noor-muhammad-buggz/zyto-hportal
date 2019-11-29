import { Routes, RouterModule } from '@angular/router';

import { ServicesComponent } from './services.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: ServicesComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
