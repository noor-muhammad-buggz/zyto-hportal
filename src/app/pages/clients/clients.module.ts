import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ClientsComponent } from './clients.component';
import { routing } from './clients.routing';

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
		ClientsComponent
  ]
})
export class ClientsModule { }
