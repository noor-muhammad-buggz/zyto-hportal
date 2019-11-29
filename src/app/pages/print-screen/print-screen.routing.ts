import { Routes, RouterModule } from '@angular/router';

import { PrintScreenComponent } from './print-screen.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
{
  path: '',
  component: PrintScreenComponent,
},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
