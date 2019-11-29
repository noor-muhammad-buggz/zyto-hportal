import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail.component';
import { routing } from './order-detail.routing';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [OrderDetailComponent]
})
export class OrderDetailModule { }
