import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { routing } from './checkout-cart.routing';
import { CheckoutCartComponent } from './checkout-cart.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    SharedModule,
  ],
  declarations: [CheckoutCartComponent]
})
export class CheckoutCartModule { }
