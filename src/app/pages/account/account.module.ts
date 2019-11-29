import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AccountComponent } from './account.component';
import { routing } from './account.routing';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		AppTranslationModule,
		ReactiveFormsModule,
		FormsModule,
		NgaModule,
    routing,
    SharedModule,
    NgbModule
	],
	declarations: [
		AccountComponent
  ]
})
export class AccountModule { }
