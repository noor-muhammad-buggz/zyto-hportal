import {SharedModule} from '../../shared/shared.module';
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientDetailComponent } from './client-detail.component';
import { routing } from './client-detail.routing';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
    routing,
    SharedModule
	],
	declarations: [
		ClientDetailComponent
	]
})
export class ClientDetailModule { }
