import { Routes, RouterModule } from '@angular/router';

import { ClientsComponent } from './clients.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ClientsComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
