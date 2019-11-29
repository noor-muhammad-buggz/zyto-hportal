import { Routes, RouterModule } from '@angular/router';

import { SessionHistoryComponent } from './session-history.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: SessionHistoryComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
