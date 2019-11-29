import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing,SharedModule],
  declarations: [Pages],
  exports:[]
})
export class PagesModule {
}
