import { Routes, RouterModule } from '@angular/router';

import { PlanEditComponent } from './plan-edit.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: PlanEditComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
