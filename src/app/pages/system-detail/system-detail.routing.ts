import { Routes, RouterModule } from '@angular/router';

import { SystemDetailComponent } from './system-detail.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: SystemDetailComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
