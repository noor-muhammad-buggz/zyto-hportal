import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: AccountComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
