import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SessionHistoryComponent } from './session-history.component';
import { routing } from './session-history.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing,
		SharedModule,
		InfiniteScrollModule
	],
	declarations: [
		SessionHistoryComponent
	]
})
export class SessionHistoryModule { }
