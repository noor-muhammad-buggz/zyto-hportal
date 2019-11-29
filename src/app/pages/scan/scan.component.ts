import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ZytoScanService } from "../../services/zyto-scan.service";
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { Observable } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';
import { GlobalState } from "../../global.state";
import 'rxjs/add/operator/takeUntil';
import * as _ from "lodash";

@Component({
    selector: "app-scan",
    templateUrl: "./scan.component.html",
    styleUrls: ["./scan.component.scss"]
})
export class ScanComponent implements OnInit, OnDestroy, AfterViewInit {
    alerts = [];
    temp: any;
    tempStatus: any;
    scanId: any;
    noti: any;
    notification: any;
    calibrated: any;
    status: any;
    startscan: any;
    insightCheck: any;
    errorMessage: any;
    progress: any = 0;
    contactStates: any = Array[5];
    contactTouches: any;
    inSession: boolean = false;
    errorLog: any;
    errorLogFile: any;
    programRun: any;
    lastDeviceStatus: any;
    lastSession: any;
    FprBiosurveyRunId: any;
    DeviceBiosurveyRunId: any;
    fpr: any;
    clientId: any = localStorage.getItem("currentSessionClientId");
    private ngUnsubscribe = new Subject();
    
    constructor(
        private _ZytoScanService: ZytoScanService,
        private zytoClientService: ZytoClientWellnessService,
        private globalState: GlobalState,
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.globalState.showLoader = true;
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
    }

    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.clientId = params['id'];
            this.programRun = params['pid'];
        });


        if (!this.programRun) {
            self.router.navigate(["/pages/clients"]);
        }

        this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
            
            console.log('Generating debuiging',resp1);
            resp1.clientId = this.clientId;
            if (resp1.Status != 'BiosurveyRun' && resp1.Status != "GeneratingInsights")
                this.globalState.foundationStatus.emit(resp1);

            this.fpr = resp1;
            this.FprBiosurveyRunId = resp1.BiosurveyRunId;
            this.status = resp1.Status.replace(/([A-Z])/g, " $1").trim();
            this.noti = resp1.Status;
            this.temp = resp1.Status;
            if (resp1.Status === "Insights") {
                this.notification = "Scan is completed";
                this.temp = "complete";
                this.progress = 100;
                if (this.startscan) {
                    this.startscan.unsubscribe();
                }

                let url = `/pages/sessions/${this.programRun}/foundations`;
                this.router.navigate([url]);
            }
            else if (resp1.Status === "GeneratingInsights") {
                this.checkInsightReady();
                this.globalState.showLoader = false;
            }
            else {
                this._ZytoScanService.GetDeviceId().subscribe(reponse => {
                    if (reponse && reponse[0]) {
                        this.DeviceBiosurveyRunId = reponse[0].BiosurveyRunId;
                        this.scanId = reponse[0].Id;
                        this._ZytoScanService.GetDeviceStatus(this.scanId).subscribe(
                            resp => {
                                self.lastDeviceStatus = resp;
                                this.calibrated = resp.Calibrated;
                                this.contactStates = resp.ContactStates;
                                const t = [];
                                _.forEach(resp.ContactStates, function (value, i) {
                                    if (value === true) {
                                        t.push(i);
                                    }
                                });
                                this.contactTouches = t.length;
                                if (this.calibrated) {
                                    this.temp = "Calibrating";
                                    this.errorMessage = "";
                                    // this.notification = "Calibrating";
                                    if (resp.BiosurveyRun && this.FprBiosurveyRunId == resp.BiosurveyRun.Id && resp.BiosurveyRun.Progress != 0) {
                                        // console.log('yasir-scanning', this.progress);
                                        // console.log('yasir-notification', this.notification);
                                        // console.log('yasir-temp', this.temp);
                                        this.temp = "scanning";
                                        this.notification = "scanning";
                                        this.tempStatus = true;
                                        const tempProgress = Math.round(
                                            resp.BiosurveyRun.Progress * 100
                                        );
                                        if (this.progress <= tempProgress) {
                                            this.progress = tempProgress;
                                        }
                                        if (this.FprBiosurveyRunId !== resp.BiosurveyRun.Id) {
                                            this.temp = "BiosurveyRun";
                                        }
                                    }

                                } else {
                                    this.errorMessage = "";
                                    this.status = "";
                                    this.temp = "no-hand";
                                    this.notification = "Please place your hand on the cradle";
                                }
                                this.globalState.showLoader = false;
                            },
                            error => {
                                this.globalState.showLoader = false;
                                this.errorMessage =
                                    "Your Hand Cradle not found. Please Connect your cradle to ZYTO system";
                                this.status = "";
                                this.notification = "cradle-404";
                                this.temp = "cradle-404";
                                // this.errorMessage = <any>error.Message;
                                if (error.status === 404) {
                                    this.errorMessage =
                                        "Your Hand Cradle not found. Please Connect your cradle to ZYTO system";
                                    this.status = "";
                                    this.notification = "cradle-404";
                                    // this.checkDeviceStatus();
                                }
                            }
                        );
                    } else {
                        this.errorMessage = "No Device is registered with this account";
                        this.status = "";
                        this.temp = "no-device";
                        this.globalState.showLoader = false;
                        self.router.navigate(["/pages/account/device"]);
                    }
                });
                this.checkDeviceStatus();
            }
        })

    }

    startProcess() {
        this.globalState.showLoader = true;
        if (this.startscan) {
            this.startscan.unsubscribe();
        }
        if (this.insightCheck) {
            this.insightCheck.unsubscribe();
        }
        
        this.writeTofile(this.errorLog);
        this.progress = 0;
        this._ZytoScanService.StartBioSurevey(this.scanId, this.FprBiosurveyRunId).subscribe(x => {
            this.checkDeviceStatus();
        }, error => {
            this.checkDeviceStatus();
        });
    }

    checkDeviceStatus() {
        const self = this;
        let interval = 1000;
        let timer = 0;
        if(this.startscan)
            this.startscan.unsubscribe();

        if (this.insightCheck) {
            this.insightCheck.unsubscribe();
        }
        this.globalState.showLoader = false;
        this.startscan = Observable.interval(interval).takeUntil(this.ngUnsubscribe).subscribe(xx => {
            console.log('Loop start');
 
            if (this.scanId) {
                console.log('Loop start 111');
                this._ZytoScanService.GetDeviceStatus(this.scanId).subscribe(
                    resp => {
                        timer = 0;
                        self.lastDeviceStatus = resp;
                        this.calibrated = resp.Calibrated;
                        const t = [];
                        _.forEach(resp.ContactStates, function (value, i) {
                            if (value === true) {
                                t.push(i);
                            }
                        });
                        this.contactTouches = t.length;
                        this.contactStates = resp.ContactStates;
                        // if (localStorage.getItem('deviceReleased') == 'true') {
                        //     let url = `/pages/clients`;
                        //     localStorage.removeItem('deviceReleased');
                        //     this.globalState.showMessage('warning', 'Device is released from this session.', 'Warning')
                        //     this.router.navigate([url]);
                        // }
                        console.log('Loop start 222');
                        if (this.calibrated) {
                            this.errorMessage = "";
                            // this.notification = "Calibrating";
                            if (resp.BiosurveyRun && this.FprBiosurveyRunId == resp.BiosurveyRun.Id && resp.BiosurveyRun.Progress != 0) {
                                console.log('scanning', this.progress);
                                // console.log('yasir-notification', this.notification);
                                // console.log('yasir-temp', this.temp);
                                this.temp = "scanning";
                                this.notification = "scanning"
                                this.tempStatus = true;
                                const tempProgress = Math.round(
                                    resp.BiosurveyRun.Progress * 100
                                );
                                // if (this.progress <= tempProgress) {
                                    this.progress = tempProgress;
                                // }
                                if (this.FprBiosurveyRunId !== resp.BiosurveyRun.Id) {
                                    this.temp = "BiosurveyRun";
                                    this.tempStatus = false;
                                    this.FoundationProgram();
                                }
                            }
                            else {
                                this.tempStatus = false;
                                this.FoundationProgram();
                            }
                        }
                        else {
                            this.errorMessage = "";
                            this.status = "";
                            this.temp = "pause-scan";
                        }
                    },
                    error => {
                        this.errorMessage =
                            "Your Hand Cradle not found. Please Connect your cradle to ZYTO system";
                        this.notification = "cradle-404";
                        this.temp = "cradle-404";
                        if (error.status === 404) {
                            this.errorMessage =
                                "Your Hand Cradle not found. Please Connect your cradle to ZYTO system";
                            this.notification = "cradle-404";
                            this.status = "";
                            if (this.noti === "WaitingForBiosurveyRunCompleted") {
                                this.temp = "cradle-404";
                            }
                            // this.checkDeviceStatus();
                        }
                        let fiveM = interval / 1000 * 60 * 5;
                        if (timer >= fiveM) {
                            this.temp = 'continueOrcancel';
                            this.startscan.unsubscribe();
                            if (this.insightCheck) {
                                this.insightCheck.unsubscribe();
                            }
                        }
                        timer++;
                    }
                );
            } else {
                this.temp = "no-device";
                this._ZytoScanService.GetDeviceId().subscribe(reponse => {
                    if (reponse && reponse[0]) {
                        this.scanId = reponse[0].Id;
                    }
                    else {
                        this.errorMessage = "No Device is registered with this account";
                        this.status = "";
                        this.temp = "no-device";
                    }
                });
            }
        });
    }

    ngOnDestroy() {
        if (this.startscan) {
            this.startscan.unsubscribe();
        }
        if (this.insightCheck) {
            this.insightCheck.unsubscribe();
        }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        // this.insightCheck.unsubscribe();
        // this._ZytoScanService.PauseBioSurevey(this.programRun).subscribe(resp => {
        //     console.log('Pause Scan');
        // });
        this.writeTofile(this.errorLog);
    }

    writeTofile(err) {
        let textFile;
        let data = new Blob([err], { type: "text/plain" });

        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        this.errorLogFile = textFile;
    }

    CheckStatus(state, biosurveyId) {
        const self = this;
        this.temp = state;
        if (state === "BiosurveyRun") {
            this.status = state.replace(/([A-Z])/g, " $1").trim();
            this.noti = state;
            this.notification = "Start Scanning";
        }
        else if (state === "GeneratingInsights") {
            this.tempStatus = true;
            this.status = state.replace(/([A-Z])/g, " $1").trim();
            this.noti = state;
            this.temp = state;
            this.errorMessage = "";
            this.notification = "Generating Insights";
            if (this.startscan) {
                this.startscan.unsubscribe();
                this.checkInsightReady();
            }
        }
        else if (state === "Insights") {
            this.status = state.replace(/([A-Z])/g, " $1").trim();
            this.noti = state;
            this.errorMessage = "";
            this.notification = "scanComplete";
            this.progress = 100;
            this.writeTofile(this.errorLog);
            if (this.startscan) {
                this.startscan.unsubscribe();
            }
            if (this.insightCheck) {
                this.insightCheck.unsubscribe();
            }
            let url = `/pages/sessions/${this.programRun}/foundations`;
            this.router.navigate([url]);

        } else {
            this.status = state.replace(/([A-Z])/g, " $1").trim();
            this.noti = state;
            this.errorMessage = "";
        }
    }

    checkInsightReady() {
        // this.globalState.showLoader = true;
        if (this.insightCheck) {
            this.insightCheck.unsubscribe();
        }
        this.insightCheck = Observable.interval(5000).takeUntil(this.ngUnsubscribe).subscribe(xx => {
            this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(resp1 => {
                resp1.clientId = this.clientId;
                // if (resp1.Status != 'BiosurveyRun' && resp1.Status != "GeneratingInsights")
                //     this.globalState.foundationStatus.emit(resp1);

                // this.globalState.showLoader = false;
                localStorage.setItem("session-ETag", resp1.ETag);
                localStorage.setItem(`currentSession`, JSON.stringify(resp1));
                this.status = resp1.Status.replace(/([A-Z])/g, " $1").trim();
                this.noti = resp1.Status;
                if (resp1.Status === "Insights") {
                    this.notification = "scanComplete";
                    this.progress = 100;
                    this.temp = "complete";
                    console.log('Generating insights 1');
                    this.redirecttoInsights();
                } else if (resp1.Status === "GeneratingInsights") {
                    this.temp = resp1.Status;
                    this.noti = resp1.Status;
                } else {
                    this.insightCheck.unsubscribe();
                    this.temp = resp1.Status;
                    this.noti = resp1.Status;
                }
                console.log('Generating insights',resp1);
            },
                error => {
                    this.errorMessage = <any>error;
                })
        });

        let time = setTimeout(() => {
            this.noti = 'FailedToGenerateInsight';
            this.insightCheck.unsubscribe();
            clearTimeout(time);
        }, 300000);
    }

    redirecttoInsights(){
        if(this.insightCheck)
            this.insightCheck.unsubscribe();
        let url = `/pages/sessions/${this.programRun}/foundations`;
        this.router.navigate([url]);
    }
    continueScan() {
        this.globalState.showLoader = true;
        console.log('scan continue');
        this.FoundationProgram();
    }
    cancelScan() {
        console.log('scan cancel');
        let url = `/pages/dashboard`;
        this.router.navigate([url]);
    }

    FoundationProgram() {
        this.zytoClientService.GetFoundationProgramRun(this.programRun).subscribe(
            resp1 => {
                console.log('Loop start 333');
                resp1.clientId = this.clientId;
                localStorage.setItem("session-ETag", resp1.ETag);
                this.status = resp1.Status.replace(/([A-Z])/g, " $1").trim();
                this.noti = resp1.Status;
                this.temp = resp1.Status;
                this.FprBiosurveyRunId = resp1.BiosurveyRunId;
                this.CheckStatus(resp1.Status, resp1.BiosurveyRunId);
                this.globalState.showLoader = false;

                if (resp1.Status != 'BiosurveyRun' && resp1.Status != "GeneratingInsights")
                    this.globalState.foundationStatus.emit(resp1);
                else
                    this.checkDeviceStatus();

            },
            error => {
                this.errorMessage = <any>error;
            }
        );
    }
    scanning1() {
        return this.temp === "BiosurveyRun" && this.calibrated;
    }

    scan0() {
        return (
            (this.temp === "scanning") &&
            this.calibrated
        );
    }
    complete() {
        return this.temp === "complete";
    }

    placehand() {
        return this.temp === "pause-scan" && !this.calibrated && !this.tempStatus;
    }

    calibrating() {
        return (
            (this.temp === "cradle-404" && this.calibrated) ||
            (this.temp === "pause-scan" &&
                this.calibrated &&
                this.notification === "Calibrating")
        );
    }

    noHand() {
        return this.temp === "cradle-404" && !this.calibrated;
    }

    errorScan() {
        return (
            this.tempStatus &&
            !this.calibrated &&
            (this.temp === "pause-scan" || this.temp === "no-hand")
        );
    }

    NoDevice() {
        return !this.scanId && this.temp === "no-device";
    }

    progressBar() {
        return (
            (this.temp === "scanning" &&
                this.notification !== "cradle-404") ||
            this.temp === "complete"
        );
    }

    insight() {
        return (
            this.noti === "GeneratingInsights"
        );
    }

    errorInsight() {
        return this.noti === 'FailedToGenerateInsight';
    }
}
