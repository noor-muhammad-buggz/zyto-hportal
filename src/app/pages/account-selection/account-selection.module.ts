import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSelectionComponent } from './account-selection.component';
import { NgaModule } from '../../theme/nga.module';
import { AccountSelectionRoutingModule, routedComponents } from './account-selection-routing.module';

@NgModule({
    imports: [
        CommonModule,
        AccountSelectionRoutingModule,
        NgaModule
    ],
    declarations: [
        ...routedComponents,
    ]
})
export class AccountSelectionModule { }
