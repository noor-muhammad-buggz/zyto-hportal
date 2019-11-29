import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutSummaryComponent } from './checkout-summary.component';
import { routing } from './checkout-summary.routing';
import {SharedModule} from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    routing,
    SharedModule
  ],
  declarations: [CheckoutSummaryComponent]
})
export class CheckoutSummaryModule { }
