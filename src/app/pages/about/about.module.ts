import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { routing } from './about.routing';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        InfiniteScrollModule,
        SharedModule
    ],
    declarations: [
        AboutComponent
    ]
})
export class AboutModule { }
