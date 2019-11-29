import { Routes, RouterModule } from '@angular/router';

import { WellnessStatusQuestionaireComponent } from './wellness-status-questionaire.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
	{
		path: '',
		component: WellnessStatusQuestionaireComponent,
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
