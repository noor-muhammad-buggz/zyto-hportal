import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanUploadComponent } from './scan-upload.component';

import { routing } from './scan-upload.routing';
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
export class ScanUploadModule { }
