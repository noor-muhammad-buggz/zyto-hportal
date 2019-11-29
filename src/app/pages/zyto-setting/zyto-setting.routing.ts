import { Routes, RouterModule } from '@angular/router';

import { ZytoSettingComponent } from './zyto-setting.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ZytoSettingComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
