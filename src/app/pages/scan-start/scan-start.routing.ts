import { Routes, RouterModule } from '@angular/router';

import { ScanStartComponent } from './scan-start.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ScanStartComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
