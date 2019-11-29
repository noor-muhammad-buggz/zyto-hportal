import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanStartComponent } from './scan-start.component';
import { routing } from './scan-start.routing';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		routing
	],
	declarations: [
		//ScanComponent
	]
})
export class ScanStartModule { }
