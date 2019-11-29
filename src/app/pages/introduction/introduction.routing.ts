import { Routes, RouterModule } from '@angular/router';

import { IntroductionComponent } from './introduction.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: IntroductionComponent,
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
