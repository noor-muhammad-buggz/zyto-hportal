import { Routes, RouterModule } from '@angular/router';

import { ScanUploadComponent } from './scan-upload.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: ScanUploadComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
