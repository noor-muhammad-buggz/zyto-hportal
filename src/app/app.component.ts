import { Component, ViewContainerRef, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, OnChanges, Renderer2, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { NgbModule, NgbModalModule, NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';
import { AuthService } from './services/auth.service';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';

import { UserService } from './services/user.service';
import { ZytoService } from './services/zyto.service';
import { ZytoScanService } from './services/zyto-scan.service';
import { ZytoClientWellnessService } from './services/zyto-client-wellness.service';
import { Observable } from 'rxjs/Rx';
import { environment } from "../environments/environment";

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let ga: Function;

//disable console logs
// if(environment.production){
//   console.dir  = () => {};
//   console.log = () => {};
// }

// this.globalState.expireLicense
/*
 * App Component
 * Top Level Component
 */

// <div class="text-center a_top_alert alert alert-dismissible fade show" rol e="alert" [ngClass]="{'alert-warning':globalState.expireLicense && !globalState.expireGraceLicense,'alert-danger':globalState.expireGraceLicense}" *ngIf="globalState.licenseAlert">
// <span *ngIf="globalState.expireLicense && !globalState.expireGraceLicense">Your license has expired. Your grace ends on {{globalState.gracePeriod | date:'MM/dd/yyyy'}} at {{globalState.gracePeriod | date:'h:mm a'}}. Please update your <strong><a href="javascript:;" [routerLink]="['/pages/account/billing']">Credit Card</a></strong>, or contact you <strong><a href="javascript:;" [routerLink]="['/pages/account']">Account Representative</a></strong> for more information.</span>
// <span *ngIf="globalState.expireGraceLicense">Your license has expired. Your functionality within ZYTO Insights will be limited until you review your license. Please update your <strong><a href="javascript:;" [routerLink]="['/pages/account/plan']">Credit Card</a></strong>, or contact you <strong><a href="javascript:;" [routerLink]="['/pages/account/manager']">Account Representative</a></strong> for more information.</span>
// <button type="button" class="close" (click)="cancelTopAlert()">
//     <span aria-hidden="true">&times;</span>
// </button>
// </div>
@Component({
    selector: 'app',
    styleUrls: ['./app.component.scss'],
    template: `
  <main [class.menu-collapsed]="isMenuCollapsed" baThemeRun [ngClass]="{'a_print_page':currentPage == true,'a_license_alert':globalState.licenseAlert == true}">
  <div class="text-center a_top_alert alert alert-dismissible fade show" rol e="alert" [ngClass]="{'alert-warning':globalState.expireLicense && !globalState.expireGraceLicense,'alert-danger':globalState.expireGraceLicense}" *ngIf="globalState.licenseAlert">
    <span *ngIf="globalState.expireLicense && !globalState.expireGraceLicense">
    Your software license expired on {{globalState.expirePeriod | date:'MM/dd/yyyy'}}. You will not be able to scan your clients after {{globalState.gracePeriod | date:'MM/dd/yyyy'}}. To continue scanning beyond this date, <a href="javascript:;" [routerLink]="['/pages/account/plan']"> click here to reactivate your subscription</a>.
    </span>
    <span *ngIf="globalState.expireGraceLicense">Your license has expired on {{globalState.gracePeriod | date:'MM/dd/yyyy'}} at {{globalState.gracePeriod | date:'h:mm a'}}. <a href="javascript:;" [routerLink]="['/pages/account/plan']"> click here to reactivate your subscription</a></span>
  </div>

  <div class="additional-bg"></div>
  <router-outlet></router-outlet>
  <ng-template #termAndConditionModal let-termc="close" let-termd="dismiss">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" (click)="termd('Cross click')"><img src="assets/images/cross-icon.png" alt=""></button>
      <h3>Disclaimer</h3>
      <!-- <h5 *ngIf="clientData">{{ clientData.PersonInfo.Name.FirstName + ' ' + clientData.PersonInfo.Name.LastName | titlecase }} please read and
        accept the most current terms of use before continuing your session. </h5> -->
    </div>
    <div class="modal-body">
      <div [innerHTML]="termAndConditionHtml"></div>
    </div>
    <div class="modal-footer">
    <!--<p>By clicking Continue you agree to the Terms of Use above.</p> -->
      <button type="button" class="btn a_red_btn" data-dismiss="modal" (click)="termd('Cancel click')">Cancel</button>
      <button (click)="termc('Close click')" type="button" class="btn a_blue_btn a_right_icon">
        continue
        <img src="assets/images/right-arrow-icon.png" alt="">
      </button>
    </div>
  </ng-template>
  <ng-template #ExpiredGracePeriod let-contrac="close" let-contrad="dismiss">
    <div class="modal-header align-items-start">
        <h4 class="modal-title">License Expired</h4>
        <button type="button" class="close" aria-label="Close" (click)="contrad('Cross click')">
			close
			<img src="assets/images/cross-icon.png" alt="">
		</button>
    </div>
    <div class="modal-body abc">
      <h5>Your license has expired on {{globalState.gracePeriod | date:'MM/dd/yyyy'}} at {{globalState.gracePeriod | date:'h:mm a'}}. <a (click)="contrac('Close click')" href="javascript:;" [routerLink]="['/pages/account/plan']"> click here to reactivate your subscription</a>. </h5>
    </div>
    <div class="modal-footer justify-content-center">
    </div>
    <div *ngIf="globalState.enabledDebug && valForm" class="row">
    <div class="col-md-12">
      <span>alreadyExisted: {{ alreadyExisted }}</span>
      <pre>{{ savedResponse | json }}</pre>
      <!-- <pre>{{ client | json }}</pre> -->
      <pre> {{ valForm.valid }} </pre>
      <pre>{{valForm.value | json}}</pre>
    </div>
  </div>
  </ng-template>
  <app-page-loader [showOverlay]="true" [showSmallLoader]="globalState.showInsightsLoader" [showFullOverlay]="globalState.showFullLoader" *ngIf="globalState.showLoader"></app-page-loader>
</main>
`,
})

export class App implements OnInit, AfterViewInit {
    isMenuCollapsed: boolean = false;
    termAndConditionHtml = '';
    sendTermEmail: any = false;
    clientData: any;

    loading = false;
    closeResult: string;



    clientId: any;
    sessionId: any = localStorage.getItem('currentSessionId');

    alreadyExisted = false;

    sections: any;
    response: any;
    contraindication: any;
    valForm: FormGroup;
    client: any;
    savedResponse: any = '';
    inSession: boolean = false;
    currentPage: boolean = false;
    BioSurevey: any;
    @ViewChild('termAndConditionModal') termAndConditionModal: ElementRef;
    @ViewChild('contraindicationModal') contraindicationModal: ElementRef;
    @ViewChild('ExpiredGracePeriod') ExpiredGracePeriod: ElementRef;
    removeLicenseAlert() {
        this.globalState.licenseAlert = false;
        console.log(123);
    }
    constructor(
        public globalState: GlobalState,
        private _imageLoader: BaImageLoaderService,
        private _spinner: BaThemeSpinner,
        private viewContainerRef: ViewContainerRef,
        private themeConfig: BaThemeConfig,
        public authService: AuthService,
        public router: Router,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        public modalService: NgbModal,
        private fb: FormBuilder,
        private zytoService: ZytoService,
        private zytoClientWellnessService: ZytoClientWellnessService,
        private zytoScanService: ZytoScanService,
        private elem: ElementRef,
        private renderer: Renderer2,
    ) {
        // this.swalTargets.confirmButton();



        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                console.log('Navigation END APP Componennt');
            }
        });

        localStorage.setItem('scanType', 'facial');
        console.dir('IN APP Component');
        authService.handleAuthentication();
        themeConfig.config();
        this._loadImages();
        this.globalState.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        //this.globalState.showLoader = true;
        console.log('App Compornent');
        // this.globalState.expireLicense = false;
        // this.globalState.expireGraceLicense = false;
        // this.removeAllSessionData();
    }

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: any) => {
                console.log('current page:', event.url);
                const page = /action-plan-print$/i;
                if (page.test(event.url)) {
                    this.currentPage = true;
                } else {
                    this.currentPage = false;
                }
            });
    };
    ngAfterViewChecked() {
        this.sidebarTopMargin();
    }
    sidebarTopMargin() {
        let windowWidth = $(window).width();
        if (this.globalState.licenseAlert) {
            let headerHeight = $('.a_top_alert').outerHeight();
            if (headerHeight) {
                if (windowWidth <= 768) {
                    $('.a_main_bg').css('top', headerHeight + 78);
                    $('.al-sidebar').css('top', headerHeight + 78);
                    $('.page-top').css('margin-top', headerHeight);
                    $('.al-main').css('padding-top', headerHeight + 78);
                } else {
                    $('.a_main_bg').css('top', headerHeight + 92);
                    $('.al-sidebar').css('top', headerHeight + 92);
                    $('.page-top').css('margin-top', headerHeight);
                    $('.al-main').css('padding-top', headerHeight + 92);
                }
            }
        } else {
            if (windowWidth <= 768) {
                $('.a_main_bg').css('top', 78);
                $('.al-sidebar').css('top', 78);
                $('.page-top').css('margin-top', 0);
                $('.al-main').css('padding-top', 78);
            } else {
                $('.a_main_bg').css('top', 92);
                $('.al-sidebar').css('top', 92);
                $('.page-top').css('margin-top', 0);
                $('.al-main').css('padding-top', 92);
            }
        }
        $('.printed-div').css('margin-top', 50);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.sidebarTopMargin();
    }
    cancelTopAlert() {
        this.globalState.licenseAlert = false;
        this.sidebarTopMargin();
    }


    ngAfterViewInit(): void {
        console.dir('in ngAfterViewInit');
        const self = this;
        //self.initContraindictionForm();
        // hide spinner once all loaders are completed
        BaThemePreloader.load().then((values) => {
            this._spinner.hide();
            console.dir('in _spinner load');
        });

        this.globalState.startSessionEvent.subscribe(client => {
            console.log('in startSessionEvent subscribed');
            console.log(client);
            self.clientData = client;
            this.globalState.showLoader = true;
            this.zytoService.GetAccountLicense().subscribe(response => {
                if (response.License && response.License.Expiration) {
                    var now = moment.utc(); //todays date
                    var end: any = (response.License.Expiration) ? moment(response.License.Expiration.KillDate) : ''; // another date
                    var duration = moment.duration(end.diff(now));
                    var hourse = duration.asHours();
                    console.log(hourse)
                    if (hourse < 12 && response.License.Expiration) {
                        const expireKill = (response.License.Expiration) ? moment(response.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
                        this.globalState.gracePeriod = expireKill;
                        const expireDate = (response.License.Expiration) ? moment(response.License.Expiration.Date).format('YYYY-MM-DD HH:mm:ss') : '';
                        this.globalState.expirePeriod = expireDate;
                        this.modalService.open(self.ExpiredGracePeriod, { windowClass: 'contraindiction_modal', size: 'lg' }).result.then((result) => {
                            this.closeResult = result;
                        }, (reason) => {
                            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                        });
                        this.globalState.showLoader = false;
                    } else {
                        self.startClientSession(client.Id, client.TermsAndConditions.AgreedToCurrent, client);
                    }
                } else {
                    self.startClientSession(client.Id, client.TermsAndConditions.AgreedToCurrent, client);
                }
            }, error => {
                this.globalState.showLoader = false;
            });

        });

        this.globalState.foundationStatus.subscribe(foundationProgram => {
            console.log('in foundationProgramRunEvent', foundationProgram);
            console.log(foundationProgram);
            this.globalState.showLoader = false;
            self.foundationProgramStatus(foundationProgram);
        });

        this.globalState.contraindictionPopupEvent.subscribe(event => {
            this.clientId = event.clientId;
            this.sessionId = event.sessionId;
            self.openContraindictionModal();
        });

        this.globalState.clearSessionLocalStorageEvent.subscribe(event => {
            self.removeAllSessionData();
        });
        this.globalState.showLoader = false;

    }

    private _loadImages(): void {
        // register some loaders
        BaThemePreloader.registerLoader(this._imageLoader.load('assets/img/sky-bg.jpg'));
    }
    foundationProgramStatus(programrun) {
        let url;
        console.log('Debug foundation', programrun);
        switch (programrun.Status) {
            case 'Questionnaire':
                url = `/pages/client/${programrun.clientId}/sessions/${programrun.Id}/wellness-status-questionnaire`;
                console.log('in state 1');
                break;
            case 'BiosurveyRun':
                let scanType = localStorage.getItem('scanType');
                if (scanType == 'facial') {
                    url = `/pages/client/${programrun.clientId}/sessions/${programrun.Id}/scan-upload`;
                } else {
                    url = `/pages/client/${programrun.clientId}/sessions/${programrun.Id}/scan`;
                }
                console.log('in state 3');
                break;
            case 'GeneratingInsights':
                let scanType1 = localStorage.getItem('scanType');
                if (scanType1 == 'facial') {
                    url = `/pages/client/${programrun.clientId}/sessions/${programrun.Id}/scan-start`;
                } else {
                    url = `/pages/client/${programrun.clientId}/sessions/${programrun.Id}/scan`;
                }
                // url = `/pages/client/${programrun.clientId}/sessions/${programrun.Id}/scan`;
                console.log('in state 4');
                break;
            case 'Insights':
                url = `/pages/sessions/${programrun.Id}/foundations`;
                localStorage.setItem('currentSessionState', 'WaitingForBiosurveyRunCompleted');
                console.log('in state 5');
                break;
            default:
                url = `/pages/cliens`;
                console.log('in state 7');
                break;
        }
        this.router.navigateByUrl(url);
    }
    startClientSession(clientId: any, agreedToCurrent = true, client: any) {
        const self = this;
        console.log('in startClientSession:', clientId);
        this.globalState.showLoader = true;
        self.removeAllSessionData();

        if (client.programId) {
            this.zytoScanService.GetSessionWithId(client.programId).subscribe(foundation => {
                if (localStorage.getItem('scanType') != 'facial') {
                    this.zytoScanService.GetDeviceId().subscribe(x => {
                        console.log(x);
                        if (x && x.length > 0) {
                            this.setupSession(foundation, clientId, agreedToCurrent, client);
                        } else {
                            self.router.navigate(["/pages/account/device"]);
                        }
                    }, error => {
                        this.globalState.showLoader = false;
                        this.globalState.showMessage('error', error.Message, 'Error')
                    });
                } else {
                    this.setupSession(foundation, clientId, agreedToCurrent, client);
                }
            }, error => {
                this.globalState.showLoader = false;
                this.globalState.showMessage('error', error.Message, 'Error')
            });
        } else {
            if (localStorage.getItem('scanType') != 'facial') {
                this.zytoScanService.GetDeviceId().subscribe(x => {
                    console.log(x);
                    if (x && x.length > 0) {
                        this.setupSession('', clientId, agreedToCurrent, client);
                    } else {
                        self.router.navigate(["/pages/account/device"]);
                    }
                }, error => {
                    this.globalState.showLoader = false;
                    this.globalState.showMessage('error', error.Message, 'Error')
                });
            } else {
                this.setupSession('', clientId, agreedToCurrent, client);

            }
        }



    }

    setupSession(foundation, clientId: any, agreedToCurrent = true, client: any) {
        const self = this;
        if (!agreedToCurrent) {
            this.zytoService.GetClientTermAndConditions().subscribe(response => {
                this.termAndConditionHtml = response.Body;
                console.log(self.termAndConditionModal);
                this.modalService.open(self.termAndConditionModal, { windowClass: 'a_terms_modal' }).result.then((result) => {
                    console.log('checked:', this.sendTermEmail);
                    this.globalState.showLoader = true;
                    if (this.sendTermEmail) {
                        this.emailTermAndConditions(clientId);
                    }
                    this.zytoService.saveClientTermAndConditions(clientId, response.AggregateInfo.Version).subscribe(termResponse => {
                        this.setupSession2(foundation, clientId, client);
                    });
                }, (reason) => {
                    this.globalState.showLoader = false;
                });
                this.globalState.showLoader = false;
            });
        } else {
            this.setupSession2(foundation, clientId, client);
        }

        localStorage.setItem('currentSessionClient', JSON.stringify(client));
    }

    setupSession2(foundation, clientId, client) {
        let self = this;
        if (client.continue) {
            let url = '';
            console.log('state:');
            console.log(foundation.Status);
            switch (foundation.Status) {
                case 'Questionnaire':
                    url = `/pages/client/${clientId}/sessions/${foundation.Id}/wellness-status-questionnaire`;
                    console.log('in state 1');
                    break;
                case 'BiosurveyRun':
                    let scanType = localStorage.getItem('scanType');
                    if (scanType == 'facial') {
                        url = `/pages/client/${clientId}/sessions/${foundation.Id}/scan-upload`;
                    } else {
                        url = `/pages/client/${clientId}/sessions/${foundation.Id}/scan`;
                    }
                    console.log('in state 3');
                    break;
                case 'GeneratingInsights':
                    url = `/pages/client/${clientId}/sessions/${foundation.Id}/scan`;
                    localStorage.setItem('currentSessionState', 'WaitingForBiosurveyRunResume');
                    console.log('in state 4');
                    break;
                case 'Insights':
                    url = `/pages/sessions/${foundation.Id}/foundations`;
                    localStorage.setItem('currentSessionState', 'WaitingForBiosurveyRunCompleted');
                    console.log('in state 5');
                    break;
                default:
                    console.log('in state 7');
                    break;
            }
            console.log(url);
            self.setupSessionAndStart(foundation, clientId, url);

        } else {
            console.log('in session create new');
            console.log('GetAccountLicense................................................\\\\\\\\\\\\\\\\\\\\');
            this.zytoService.GetAccountLicense().subscribe(resp => {
                localStorage.setItem("eTag", resp.ETag);
                localStorage.setItem("accountDetail", JSON.stringify(resp));
                const expire = (resp.License.Expiration) ? moment(moment.utc(resp.License.Expiration.Date).toDate()).format('YYYY-MM-DD HH:mm:ss') : '';
                const expireKill = (resp.License.Expiration) ? moment(resp.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
                var now = moment.utc(); //todays date
                var end = (resp.License.Expiration) ? moment(resp.License.Expiration.Date) : moment(); // another date
                var endKill = (resp.License.Expiration) ? moment(resp.License.Expiration.KillDate) : moment(); // another date
                var duration = moment.duration(end.diff(now));
                var durationkill = moment.duration(endKill.diff(now));
                var hourse = duration.asHours();
                var hourseKill = durationkill.asHours();
                console.log(hourse)
                // if (hourse < 0 && resp.License.Expiration) {
                //   this.globalState.gracePeriod = expireKill;
                //   this.globalState.expirePeriod = expire;
                //   this.globalState.expireLicense = true;
                //   this.globalState.licenseAlert = true;
                //   this.globalState.expireGraceLicense = false;
                // }
                // else 
                if (hourseKill < 12 && resp.License.Expiration) {
                    this.globalState.gracePeriod = expireKill;
                    this.globalState.expirePeriod = expire;
                    this.globalState.expireLicense = true;
                    this.globalState.licenseAlert = true;
                    this.globalState.expireGraceLicense = true;
                } else {
                    this.zytoService.CreateSession(clientId).subscribe(session => {

                        self.setupSessionAndStart(session, clientId);
                        // this.globalState.showLoader = false;
                    });
                }
            });
        }


    }
    setupSessionAndStart(session, clientId, url: string = null) {
        console.log('in session.ClientId', session);
        localStorage.setItem('currentSessionId', session.Id);
        localStorage.setItem('currentSessionClientId', clientId);
        localStorage.setItem(`currentSession`, JSON.stringify(session));
        localStorage.setItem('programRun', session.Id);
        //localStorage.setItem(`lastSession-${clientId}`, JSON.stringify(session));
        // this.globalState.showLoader = false;
        // this.zytoClientWellnessService.GetFoundationProgramRun(session.Id).subscribe(response => {
        if (url)
            this.router.navigateByUrl(url);
        else
            this.router.navigate([`/pages/client/${clientId}/sessions/${session.Id}/wellness-status-questionnaire`]);
        // }, error => {
        //     this.globalState.showMessage('error', this.globalState.showMessage('error', (error.Message) ? error.Message : error, 'Error'), 'Error')
        //     this.globalState.showLoader = false;
        // });


    }

    emailTermAndConditions(clientId: any) {
        console.log('in emailTermAndConditions');
        this.zytoService.emailClientTermAndConditions(clientId).subscribe(response => {
        });
    }

    initContraindictionForm() {
        this.valForm = this.fb.group({
            'Questionnaire': this.fb.group({
                'Id': ['', Validators.required],
                'Version': ['', Validators.required],
            }),
            'QuestionResults': this.fb.array([]),
        });

        if (localStorage.getItem('currentSessionId')) {
            this.inSession = true;
        } else {
            this.inSession = false;
        }

        //this.loading = true;
        //this.globalState.showLoader = true;
        this.alreadyExisted = false;
    }

    openContraindictionModal() {
        const self = this;
        self.initContraindictionForm();
        this.zytoScanService.GetContradiction(1, this.sessionId).subscribe(response => {
            console.dir(response);
            // if(response && response.QuestionResults)
            // response.QuestionResults = response.QuestionResults.reverse();
            this.contraindication = response;
            this.response = response;
            this.sections = _.mapValues(_.groupBy(response.Sections, 'Type'),
                clist => clist.map(section => _.omit(section, 'Type')));
            this.globalState.showLoader = false;
            console.dir(this.sections);
            const formGroup = <FormArray>self.valForm.controls['Questionnaire'];
            formGroup.controls['Id'].patchValue(response.Id);
            formGroup.controls['Version'].patchValue(response.AggregateInfo.Version);
            const control = <FormArray>self.valForm.controls['QuestionResults'];

            for (const key in this.sections) {
                const section = this.sections[key];
                section.forEach((section, index) => {
                    const sectionGroup = self.initSection(index);
                    section.Questions.forEach(element => {
                        const defaultValue = (key == 'Boolean') ? 'True' : 'Never';
                        const formGroup = self.initQuestionResult(element.Id, defaultValue);
                        sectionGroup.push(formGroup);
                    });
                    control.push(sectionGroup);
                });
            }
            //this.loading = false;
            //this.globalState.showLoader = false;

            console.log(this.sections);

            this.savedResponse = response;
            // let temp = this.savedResponse.QuestionResults;
            // console.log('this.savedResponse 1:',temp);
            // temp = _.sortBy(temp, [function(o) { return o.Id; }]);
            // //this.savedResponse.QuestionResults = this.savedResponse.QuestionResults.reverse();
            // //temp = temp.reverse();
            // console.log('this.savedResponse 2:',temp);
            this.alreadyExisted = true;

            this.updateFormValues();

            //if (localStorage.getItem('existingSessionStarted')) {
            // this.zytoClientWellnessService.GetSavedWellnessProfileQuestionnaires(this.clientId).subscribe(savedResponse => {
            //   console.log('in GetSavedWellnessProfileQuestionnaires');
            //   this.savedResponse = savedResponse;
            //   this.alreadyExisted = true;

            //   this.updateFormValues();
            //   this.updateDesignChanges();

            // });
            //}


        });

        this.modalService.open(self.contraindicationModal, { windowClass: 'contraindiction_modal', size: 'lg' }).result.then((result) => {
            this.closeResult = result;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    initQuestionResult(index, defaultValue) {
        index = index || 0;

        const questionReslutGroup = this.fb.group({
            'Id': [index, Validators.required],
            'Result': [defaultValue, Validators.required],
        });

        return questionReslutGroup;
    }

    initSection(index) {
        index = index || 0;
        const key = `section-${index}`;
        const sectionGroup = this.fb.array([]);
        return sectionGroup;
    }

    updateFormValues() {
        const self = this;
        let data;

        if (this.savedResponse) {
            data = this.savedResponse;
            console.log(data);

            const formGroup = <FormArray>self.valForm.controls['Questionnaire'];
            const control = <FormArray>self.valForm.controls['QuestionResults'];

            let questionIndex = 0;
            for (let index = 0; index < control.length; index++) {
                const formGroup: any = <FormArray>control.controls[index];
                Object.keys(formGroup.controls).forEach(key => {
                    let tempQuestions = _.find(data.QuestionResults, function (o: any) {
                        return o.Id == formGroup.get(key).controls.Id._value;
                    });
                    formGroup.get(key).patchValue(tempQuestions);
                    questionIndex++;
                });
                if (index === control.length - 1) {
                }
            }
        }

    }

    onsubmit(value, c) {
        console.log('in submit');
        c();
        const self = this;
        console.log(value);
        console.log(_.flatten(value.QuestionResults));
        value.QuestionResults = _.flatten(value.QuestionResults);

        this.globalState.showLoader = true;


        const method = (this.alreadyExisted) ? 'put' : 'post';
        // console.log(value);
        // console.log(this.clientId);
        //this.savedResponse.QuestionResults = value.QuestionResults;
        delete value['Questionnaire'];
        this.zytoScanService.saveContradiction(1, value, method, this.sessionId).subscribe(response => {
            this.globalState.showMessage('success', 'Contraindication Successfully Saved', 'Contraindication');
            // this.globalState.showLoader = false;
            this.zytoScanService.CreateBiosurveyRunImportRuns(localStorage.getItem('accountId'), this.sessionId, 1).subscribe(response => {
                const id = response.Id;
                this.globalState.showLoader = true;
                this.globalState.showInsightsLoader = true;
                this.BioSurevey = Observable.interval(5000).subscribe(resp => {
                    this.zytoScanService.GetBiosurveyRunImportRuns(localStorage.getItem('accountId'), this.sessionId, 1, id).subscribe(response => {
                        // this.globalState.showLoader = false;
                        if (response.State == 'Completed') {
                            this.globalState.dataProcessEvent.emit({});
                            this.BioSurevey.unsubscribe();
                            clearTimeout(time);
                            this.globalState.showLoader = false;
                            this.globalState.showInsightsLoader = false;
                        }
                    });
                });
                let time = setTimeout(() => {
                    this.BioSurevey.unsubscribe();
                    this.globalState.showLoader = false;
                    this.globalState.dataProcessEvent.emit({});
                    this.globalState.showInsightsLoader = false;
                }, 300000);

            });

            // remove from draft
            // this.zytoClientWellnessService.RemoveWellnessProfileDraft(this.clientId).subscribe(response1 => { });

            // if (!this.inSession) {
            //   self.router.navigate([`/pages/client/${this.clientId}/client-detail`]).then(() => {
            //     this.globalState.showLoader = false;
            //   });
            // } else {
            //   //update wellness result version
            //   const body = {
            //     'ClientWellnessProfileQuestionnaireResultVersion': response.AggregateInfo.Version,
            //   };
            //   this.zytoClientWellnessService.updateClientWellnesssProfileResultVersion(localStorage.getItem('currentSessionId'), body).subscribe(response2 => {
            //     this.globalState.showLoader = false;
            //     self.router.navigate(['/pages/client/'.concat(this.clientId).concat('/scan')]);
            //   });
            // }

        }, error => {
            this.globalState.showMessage('error', this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Exception.Message, 'Error'), 'Error')
            this.globalState.showLoader = false;
        });

    }


    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }



    removeAllSessionData() {
        localStorage.removeItem('currentSession');
        localStorage.removeItem('currentSessionClient');
        localStorage.removeItem('currentSessionClientId');
        localStorage.removeItem('currentSessionId');
        // localStorage.removeItem('currentSessionInsight');
        localStorage.removeItem('currentSessionState');
    }

}
