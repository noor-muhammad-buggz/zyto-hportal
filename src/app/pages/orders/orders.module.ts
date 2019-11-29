import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { OrdersComponent } from './orders.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './orders.routing';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		InfiniteScrollModule,
		SharedModule
	],
	declarations: [
		OrdersComponent
	]
})
export class OrdersModule { }
