import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { GlobalState } from '../../global.state';
import { ZytoScanService } from '../../services/zyto-scan.service';
import { Subject, TimeInterval, Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-scan-start',
    templateUrl: './scan-start.component.html',
    styleUrls: ['./scan-start.component.scss', '../../theme/sass/as_custom.css']
})
export class ScanStartComponent implements OnInit, AfterViewInit {

    programRun: any;
    facialId: any;
    facialData: any;
    fpr: any;
    state: any = 'start';
    clientId: any = localStorage.getItem("currentSessionClientId");
    locX: any = 0;
    locY: any;
    loc: any;
    count: any = 0;
    timeStamp: any = [];
    private ngUnsubscribe = new Subject();
    startscan: any;
    startInsights: any;

    constructor(
        private _ZytoScanService: ZytoScanService,
        private zytoClientService: ZytoClientWellnessService,
        private globalState: GlobalState,
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.globalState.showLoader = false;
        localStorage.removeItem('deviceReleased');
    }

    ngAfterViewInit(): void {
        if (
            localStorage.getItem("currentSession") &&
            localStorage.getItem("currentSessionClient")
        ) {
            const sessionClient = JSON.parse(
                localStorage.getItem("currentSessionClient")
            );
            const currentSession = JSON.parse(localStorage.getItem("currentSession"));
            let date: any = new Date(currentSession.AggregateInfo.CreatedDate);
            date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            this.globalState.currentPageSubTitle = `${
                sessionClient.PersonInfo.Name.FirstName
                } ${sessionClient.PersonInfo.Name.LastName} | ${date}`;
        }
        this.globalState.currentPage = "scan";
        this.globalState.currentPageTitle = "Scan";
        this.globalState.showLoader = true;
    }

    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.clientId = params['id'];
            this.programRun = params['pid'];
            this.facialId = params['fid'];
        });


        if (!this.programRun) {
            self.router.navigate(["/pages/clients"]);
        }

        this._ZytoScanService.GetFacialRecognitionById(this.facialId).subscribe(resp => {
            console.log(resp);
            this.facialData = resp;
            if (resp.Status !== 'Click') {
                this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
                    resp1.clientId = this.clientId;
                    this.globalState.foundationStatus.emit(resp1);
                });
            } else if (resp.Status == 'Completed') {
                this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
                    this.checkStatus(resp1.BiosurveyRunId);
                });
            }
            this.globalState.showLoader = false;
        });

    }
    
    startScan() {
        this.state = 'randomize';
        this.loc = Math.floor(Math.random() * 8);
        this.randomizeImage();
        // const abc = setInterval(this.randomizeImage, 3000);
        // console.log(abc);
    }

    randomizeImage() {
        
        
        const X = [40, 0, 50, 5, 80, 15, 70, 10, 60];
        const Y = [3, 40, 40, 5, 20, 20, 40, 20, 8];
        // let xt = Math.floor(Math.random() * 8);
        // let yt = Math.floor(Math.random() * 8);
        this.loc++;
        if(this.loc > 8){
            this.loc = 1;
        }
        this.locX = X[this.loc];
        this.locY = Y[this.loc];
        this.timeStamp.push(moment().utc().format());
        this.count++;
        if (this.count > 5) {
            this.globalState.showLoader = true;
            this._ZytoScanService.ChangeClickTimestamps(this.facialId, this.timeStamp).subscribe(resp => {
                const clinetsig = resp.ClientSignature;
                this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
                    this._ZytoScanService.StartRunWithClientSignature(resp1.BiosurveyRunId, clinetsig).subscribe(resp2 => {
                        this.checkStatus(resp1.BiosurveyRunId);
                    })
                });
                console.log(resp);
            }, error => {
                this.globalState.showLoader = false;
                this.globalState.showMessage('error', error.Message, 'Error')
                this.state = 'randomize';
            });
        }
        
        console.log(this.timeStamp);
    }
    checkStatus(BiosurveyRunId) {
        const self = this;
        let interval = 1000;
        let timer = 0;
        if (this.startscan)
            this.startscan.unsubscribe();

        this.startscan = Observable.interval(interval).takeUntil(this.ngUnsubscribe).subscribe(xx => {
            this._ZytoScanService.GetBiosurveyRunById(BiosurveyRunId).subscribe(resp => {
                this.state = 'scan';
                if (this.globalState.showLoader)
                    this.globalState.showLoader = false;

                if (resp.State != 'Completed') {
                    let fiveM = interval / 1000 * 60 * 5;
                    if (timer >= fiveM) {
                        this.state = 'continueOrcancel';
                        this.startscan.unsubscribe();
                    }
                    timer++;
                } else {
                    this.startscan.unsubscribe();
                    this.checkInsights();
                }

            });
        });
    }

    checkInsights() {
        this.startInsights = Observable.interval(1000).takeUntil(this.ngUnsubscribe).subscribe(xx => {
            this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
                resp1.clientId = this.clientId;
                this.state = 'GeneratingInsights';
                if (resp1.Status === 'GeneratingInsights') {
                } else {
                    this.startInsights.unsubscribe();
                    this.globalState.foundationStatus.emit(resp1);
                }
            });
        });
    }

    continueScan() {
        this.globalState.showLoader = true;
        console.log('scan continue');
        this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
            resp1.clientId = this.clientId;
            this.checkStatus(resp1.BiosurveyRunId);
        });
    }
    cancelScan() {
        console.log('scan cancel');
        let url = `/pages/dashboard`;
        this.router.navigate([url]);
    }

}
