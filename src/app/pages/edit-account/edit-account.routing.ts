import { Routes, RouterModule } from '@angular/router';

import { EditAccountComponent } from './edit-account.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: EditAccountComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
