import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WellnessStatusQuestionaireComponent } from '../pages/wellness-status-questionaire/wellness-status-questionaire.component';
import { FoundationsComponent } from '../pages/foundations/foundations.component';
import { FoundationDetailComponent } from '../pages/foundation-detail/foundation-detail.component';
import { ActionPlansComponent } from '../pages/action-plans/action-plans.component';
import { SystemDetailComponent } from '../pages/system-detail/system-detail.component';
import { PlanEditComponent } from '../pages/plan-edit/plan-edit.component';
import { PlanUpgradeComponent } from '../pages/plan-upgrade/plan-upgrade.component';
import { ScanComponent } from '../pages/scan/scan.component';
import { ScanUploadComponent } from '../pages/scan-upload/scan-upload.component';
import { ScanStartComponent } from '../pages/scan-start/scan-start.component';
import { PageLoaderComponent } from '../components/page-loader/page-loader.component';

import { NameInitialsPipe } from '../mix/nameInitials.pipe';
import { FilterInsightPipe } from '../mix/filterInsight.pipe';
import { TrimPipe } from '../mix/trim.pipe';
import { PairsPipe } from '../mix/pairs.pipe';
import { ChartsModule } from 'ng2-charts';
import { Daterangepicker } from 'ng2-daterangepicker';
import { CKEditorModule } from 'ng2-ckeditor';
import { FileUploadModule } from 'ng2-file-upload';
import { ReadMoreDirective } from '../read-more.directive';
import { Auth0CallbackComponent } from '../components/auth0-callback/auth0-callback.component';
import { ZoneDetailComponent } from '../components/zone-detail/zone-detail.component';
// import { WebCamModule } from 'ack-angular-webcam';

@NgModule({
  declarations: [
    PageLoaderComponent,
    NameInitialsPipe,
    FilterInsightPipe,
    TrimPipe,
    PairsPipe,
    WellnessStatusQuestionaireComponent,
    FoundationsComponent,
    FoundationDetailComponent,
    SystemDetailComponent,
    PlanUpgradeComponent,
    ActionPlansComponent,
    ScanComponent,
    ScanUploadComponent,
    ScanStartComponent,
    ZoneDetailComponent,
    
    //Ckeditor,
    Auth0CallbackComponent,
    ReadMoreDirective,
  ],
  imports: [
      CKEditorModule,CommonModule, NgbModule, FormsModule, ReactiveFormsModule, ChartsModule,RouterModule,Daterangepicker,FileUploadModule
      // , WebCamModule
    ],
 // providers: [],
  exports: [
    CommonModule,
    RouterModule,
    CKEditorModule,
    PageLoaderComponent,
    NameInitialsPipe,
    FilterInsightPipe,
    TrimPipe,
    PairsPipe,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    WellnessStatusQuestionaireComponent,
    ZoneDetailComponent,
    ScanComponent,
    ChartsModule,
    Daterangepicker,
    FileUploadModule,
    Auth0CallbackComponent,
    ReadMoreDirective,
    // WebCamComponent
  ],
})
export class SharedModule {}
