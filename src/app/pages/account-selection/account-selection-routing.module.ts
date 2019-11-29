import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSelectionComponent } from './account-selection.component';

const routes: Routes = [{
    path: '',
    component: AccountSelectionComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountSelectionRoutingModule { }

export const routedComponents = [
    AccountSelectionComponent
];
