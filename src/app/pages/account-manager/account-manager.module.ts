import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountManagerComponent } from './account-manager.component';
import { routing } from './account-manager.routing';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing
    ],
    declarations: [
        AccountManagerComponent
    ]
})
export class AccountManagerModule { }
