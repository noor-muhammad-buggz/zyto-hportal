import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ZytoSettingComponent } from './zyto-setting.component';
import { routing } from './zyto-setting.routing';

import { SharedModule } from '../../shared/shared.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
        SharedModule,
        NgbModule,
        
    ],
    declarations: [
        ZytoSettingComponent,
    ],
    providers: [NgbActiveModal],
})
export class ZytoSettingModule { }
