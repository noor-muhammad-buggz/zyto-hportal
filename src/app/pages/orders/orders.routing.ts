import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: OrdersComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
