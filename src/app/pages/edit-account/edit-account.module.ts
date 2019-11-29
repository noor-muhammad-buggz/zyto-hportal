import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditAccountComponent } from './edit-account.component';
import { routing } from './edit-account.routing';
import { NgaModule } from '../../theme/nga.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        NgaModule
    ],
    declarations: [
        EditAccountComponent
    ]
})
export class EditAccountModule { }
