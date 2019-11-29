import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ClientComponent } from './client.component';
import { routing } from './client.routing';

import { SharedModule } from '../../shared/shared.module';
import { CalendarModule } from 'primeng/primeng';

@NgModule({
	imports: [
		CommonModule,
		AppTranslationModule,
		ReactiveFormsModule,
		FormsModule,
		NgaModule,
		CalendarModule,
    routing,
    SharedModule,
    NgbModule
	],
	declarations: [
		ClientComponent
  ]
})
export class ClientModule { }
