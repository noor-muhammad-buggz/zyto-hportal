import { Routes, RouterModule } from '@angular/router';

import { ClientDetailComponent } from './client-detail.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ClientDetailComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
