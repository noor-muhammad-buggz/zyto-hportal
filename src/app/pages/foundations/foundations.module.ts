import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './foundations.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	imports: [
	CommonModule,
	AppTranslationModule,
	ReactiveFormsModule,
	FormsModule,
    routing,
    SharedModule,
	],
	declarations: [
		//WellnessStatusComponent,
	]
})
export class FoundationsModule { }
