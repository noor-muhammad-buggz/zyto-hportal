import { Routes, RouterModule } from '@angular/router';

import { PlanUpgradeComponent } from './plan-upgrade.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: PlanUpgradeComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
