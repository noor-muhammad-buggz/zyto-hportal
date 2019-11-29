import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BillingComponent } from './billing.component';
import { routing } from './billing.routing';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routing
    ],
    declarations: [
        BillingComponent
    ]
})
export class BillingModule { }
