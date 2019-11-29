import { Routes, RouterModule } from '@angular/router';

import { ScanComponent } from './scan.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ScanComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
