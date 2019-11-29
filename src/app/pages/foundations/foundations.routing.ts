import { Routes, RouterModule } from '@angular/router';

import { FoundationsComponent } from './foundations.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: FoundationsComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
