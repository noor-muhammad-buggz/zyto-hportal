import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from 'angular2-image-upload';
import { TranslateService } from '@ngx-translate/core';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { NgbDateFRParserFormatter } from './mix/ngb-date-fr-parser-formatter';
import { SortablejsModule } from 'angular-sortablejs';


/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { AnalyticsService } from './services/analytics.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';


import { AuthGuard } from './guards/auth.guard';
import { SessionCancelGuard } from './guards/cancel-session.guard';
import { CompleteSessionGuard } from './guards/complete-session.guard';

import { UserService } from './services/user.service';
import { ZytoService } from './services/zyto.service';
import { AuthService } from './services/auth.service';
import { ZytoScanService } from './services/zyto-scan.service';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { ZytoClientWellnessService } from './services/zyto-client-wellness.service';
import { ClientResolve } from './pages/client-detail/client-detail.resolve.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';

// Application wide providers
const APP_PROVIDERS = [
    AuthGuard,
    SessionCancelGuard,
    CompleteSessionGuard,
    AppState,
    AnalyticsService,
    GlobalState,
    AuthService,
    UserService,
    ZytoService,
    ZytoScanService,
    ClientResolve,
    ZytoClientWellnessService,
    GoogleAnalyticsEventsService,
];

export type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig(), http, options);
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [App],
    declarations: [
        App,

    ],
    imports: [ // import Angular's modules
        BrowserModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
        HttpModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule.forRoot(),
        NgbModule.forRoot(),
        PagesModule,
        routing,
        SharedModule,
        ImageUploadModule.forRoot(),
        //NgUploaderModule,
        SortablejsModule.forRoot({ animation: 150 }),
    ],
    exports: [
        SharedModule,
        NgaModule,
        ImageUploadModule,
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        APP_PROVIDERS,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions],
        },
        { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
    ],
})

export class AppModule {

    constructor(public appState: AppState) {
    }
}
