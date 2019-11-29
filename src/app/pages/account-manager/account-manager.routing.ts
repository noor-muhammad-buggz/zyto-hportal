import { Routes, RouterModule } from '@angular/router';

import { AccountManagerComponent } from './account-manager.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: AccountManagerComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
