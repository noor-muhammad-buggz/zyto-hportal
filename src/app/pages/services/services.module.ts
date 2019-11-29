import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ServicesComponent } from './services.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './services.routing';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        InfiniteScrollModule,
        SharedModule
    ],
    declarations: [
        ServicesComponent
    ]
})
export class ServicesModule { }
