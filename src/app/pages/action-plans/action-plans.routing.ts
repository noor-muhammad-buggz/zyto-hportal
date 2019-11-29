import { Routes, RouterModule } from '@angular/router';

import { ActionPlansComponent } from './action-plans.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ActionPlansComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
