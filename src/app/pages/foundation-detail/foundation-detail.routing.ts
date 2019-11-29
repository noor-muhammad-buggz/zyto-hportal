import { Routes, RouterModule } from '@angular/router';

import { FoundationDetailComponent } from './foundation-detail.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: FoundationDetailComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
