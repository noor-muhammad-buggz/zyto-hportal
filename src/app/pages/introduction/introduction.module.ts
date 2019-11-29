import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { SharedModule } from '../../shared/shared.module';
import { IntroductionComponent } from './introduction.component';
import { routing } from './introduction.routing';

import { VideoJSComponent } from '../../components/videojs/videojs.component';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    SharedModule,
  ],
  declarations: [
    IntroductionComponent,
    VideoJSComponent,
  ]
})
export class IntroductionModule { }
