import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanEditComponent } from './plan-edit.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './plan-edit.routing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		InfiniteScrollModule,
		SharedModule
	],
	declarations: [
		PlanEditComponent
	]
})
export class PlanEditModule { }
