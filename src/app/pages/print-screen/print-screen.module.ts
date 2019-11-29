import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { routing } from './print-screen.routing';
import { PrintScreenComponent } from './print-screen.component';
import { SortablejsModule } from 'angular-sortablejs';
import { CalendarModule } from 'primeng/primeng';
// import {DatePickerModule} from 'ng2-datepicker-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    SharedModule,
    SortablejsModule,
    CalendarModule,
    // DatePickerModule,
  ],
  declarations: [PrintScreenComponent],
})
export class PrintScreenModule { }
