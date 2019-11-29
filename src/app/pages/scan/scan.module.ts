import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScanComponent } from './scan.component';
import { routing } from './scan.routing';

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
export class ScanModule { }
