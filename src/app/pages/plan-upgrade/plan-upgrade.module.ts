import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanUpgradeComponent } from './plan-upgrade.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './plan-upgrade.routing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
// import { OrdersComponent } from '../orders';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		InfiniteScrollModule,
		SharedModule
	],
	declarations: [
		// OrdersComponent
	]
})
export class PlanUpgradeModule { }
