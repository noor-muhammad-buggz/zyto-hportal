import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutCompleteComponent } from './checkout-complete.component';
import { routing } from './checkout-complete.routing';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [CheckoutCompleteComponent]
})
export class CheckoutCompleteModule { }
