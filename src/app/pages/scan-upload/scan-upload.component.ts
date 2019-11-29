import { Component, OnInit, OnDestroy, AfterViewInit, SimpleChanges, ViewChild } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { GlobalState } from '../../global.state';
import { ZytoScanService } from '../../services/zyto-scan.service';
import { Subject } from 'rxjs';
import { FileSelectDirective, FileDropDirective, FileUploader, FileItem, ParsedResponseHeaders, FileLikeObject } from 'ng2-file-upload/ng2-file-upload';
import * as _ from 'lodash';
import { environment } from 'environments';
import { isNgTemplate } from '../../../../node_modules/@angular/compiler';
// import { WebCamComponent } from 'ack-angular-webcam';
// import * as domtoimage from 'dom-to-image';
declare var Webcam: any;
declare var $: any;
@Component({
    selector: 'app-scan-upload',
    templateUrl: './scan-upload.component.html',
    styleUrls: ['./scan-upload.component.scss', '../../theme/sass/as_custom.css'],

})
export class ScanUploadComponent implements OnInit, AfterViewInit {

    programRun: any;
    clientId: any = localStorage.getItem("currentSessionClientId");
    facialId: any;
    facialData: any;
    client: any;
    url: any;
    private ngUnsubscribe = new Subject();
    allowedMimeType = ["image/png", "image/jpeg"];
    maxFileSize = 6 * 1024 * 1024; //6 Mb
    uploader: FileUploader;
    webCam: any = false;
    cameras: any;
    selectedCamera: any = '';
    @ViewChild('imageUpload') public imageUpload: any;


    constructor(
        private _ZytoScanService: ZytoScanService,
        private zytoClientService: ZytoClientWellnessService,
        private globalState: GlobalState,
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.initializeUploader();
        this.globalState.showLoader = true;
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log('changes:', changes);
        if (changes.uploaderOptions) {
            this.initializeUploader();
        }
    }
    ngOnDestroy() {
        Webcam.reset();
    }
    ngAfterViewInit(): void {
        if (
            localStorage.getItem("currentSession") &&
            localStorage.getItem("currentSessionClient")
        ) {
            const sessionClient = JSON.parse(
                localStorage.getItem("currentSessionClient")
            );
            this.client = sessionClient;
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
            this._ZytoScanService.GetBiosurveyRunById(resp1.BiosurveyRunId).subscribe(resp2 => {
                if (resp2.ClientSignature) {
                    self.router.navigate([`/pages/client/${this.clientId}/sessions/${this.programRun}/facial/scan/${this.facialId}`]);
                    // let url = `/pages/client/${this.clientId}/sessions/${this.programRun}/scan-upload`;
                    // this.router.navigate([url]);
                }
            });
        });

        this._ZytoScanService.createFacialRecognition(this.clientId).subscribe(response => {
            this.globalState.showLoader = false;
            this.facialId = response.Id;
            this.facialData = response;
            this.initializeUploader();

        }, error => {
            this.globalState.showLoader = false;
            this.globalState.showMessage('error', error.Message, 'Error')
        });



        // this.uploader.onCompleteItem(resizeBy,)
    }


    startWebcam() {
        let selff = this;

        if (navigator.mediaDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(deviceInfos => {
                    let devices = new Array();
                    for (var i = 0; i !== deviceInfos.length; ++i) {
                        var deviceInfo = deviceInfos[i];

                        if (deviceInfo.kind === 'videoinput') {
                            devices.push(deviceInfo);
                        } else {
                            console.log('Found one other kind of source/device: ', deviceInfo);
                        }
                    }
                    console.log(devices);
                    selff.cameras = devices;

                }).then(cam => {
                    selff.webCam = true;
                    Webcam.set({
                        width: 520,
                        height: 300,
                        image_format: 'jpeg',
                        jpeg_quality: 100,
                        sourceId: selff.cameras[0]
                    });
                    Webcam.attach('#my_camera');
                    Webcam.on('error', function (err) {
                        selff.globalState.showMessage('error', err, 'Error');
                    });

                }).catch();
        } else {
            selff.webCam = true;
            Webcam.set({
                width: 520,
                height: 300,
                image_format: 'jpeg',
                jpeg_quality: 100,
            });
            

            Webcam.attach('#my_camera');
            Webcam.on('error', function (err) {
                selff.globalState.showMessage('error', err, 'Error');
            });
        }
    }


    stopWebcam() {
        Webcam.reset();
    }
    //---------------------
    // TAKE A SNAPSHOT CODE
    //---------------------

    snapshot() {
        let self = this;
        
        Webcam.snap(function (data_uri) {
            // display results in page
            Webcam.reset();
            let blob: any = self.dataURItoBlob(data_uri);
            blob['name'] = 'myfilename.png';
            self.uploader.addToQueue([blob]);
            self.uploader.uploadAll();
            self.webCam = false;
        });

    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);


        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }






    changeCamera() {
        let self = this;
        console.log(this.selectedCamera);
        Webcam.reset();
        Webcam.set({
            // force_flash: true,
            sourceId: this.selectedCamera
        });
        Webcam.attach('#my_camera');
        Webcam.on('error', function (err) {
            self.globalState.showMessage('error', err, 'Error');
        });
    }

    onCamError(err) { }

    onCamSuccess() { }

    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        console.log(JSON.parse(response));
        this.facialData = JSON.parse(response);
        this._ZytoScanService.FindFaceInImage(this.facialId).subscribe(resp => {
            this.facialData = resp;
            this.globalState.showLoader = false;
        }, error => {
            this.globalState.showLoader = false;
            this.globalState.showMessage('error', 'Face is not found', 'Error');
            this.globalState.showLoader = false;
        })
    }

    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        console.log(JSON.parse(response));
        let resp = JSON.parse(response);
        this.globalState.showLoader = false;
        this.globalState.showMessage('error', resp.Message, 'Error');
    }

    initializeUploader() {
        this.allowedMimeType = ["image/png", "image/jpeg"];
        this.maxFileSize = 6 * 1024 * 1024; //6 Mb

        this.uploader = new FileUploader({
            authToken: "Bearer " + localStorage.getItem("id_token"),
            url: environment.ApiBaseUrl.concat(`accounts/${localStorage.getItem('accountId')}/facialrecognitionscans/${this.facialId}`).concat('/image/upload'),
            allowedMimeType: this.allowedMimeType,
            maxFileSize: this.maxFileSize,
            autoUpload: true,
        });

        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            this.globalState.showLoader = true;
        }

        this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
        this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.uploader.onWhenAddingFileFailed = (item, filter, options) =>
            this.onWhenAddingFileFailed(item, filter, options);
        // this.uploader.onCompleteItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    }

    onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
        console.log('in onWhenAddingFileFailed');
        let errorMessage;
        switch (filter.name) {
            case "fileSize":
                //let limitSizeMB = Math.round(this.maxFileSize / (1024 * 1024));
                //let actualSizeMB = Math.round(item.size / (1024 * 1024));
                errorMessage = `Maximum upload size exceeded (6 MB allowed)`;
                break;
            case "mimeType":
                const allowedTypes = this.allowedMimeType.join();
                errorMessage = `Type "${
                    item.type
                    } is not allowed. Allowed types: "${allowedTypes}"`;
                break;
            case "imageDimension":
                errorMessage = `Dimension Exceeded - Allowed Image dimension are 5000px(w) x 5000px(h)`;
                break;
            default:
                errorMessage = `Unknown error (filter is ${filter.name})`;
        }
        this.globalState.showMessage('error', errorMessage, 'Error');
        //this.productImage = null;
        $('#fileInput').val('');
    }

    faceVerified() {
        this.globalState.showLoader = true;
        this._ZytoScanService.FaceVerified(this.facialId).subscribe(resp => {
            this.facialData = resp;
            this.router.navigate([`/pages/client/${this.clientId}/sessions/${this.programRun}/facial/scan/${this.facialId}`]);
            this.globalState.showLoader = false;
        });
    }

    faceNotVerified() {
        this.globalState.showLoader = true;
        this._ZytoScanService.FaceVerificationFailed(this.facialId).subscribe(resp => {
            this.facialData = resp;
            this.globalState.showMessage('error', 'Face is not verified. Upload Image again', 'Error');
            this.globalState.showLoader = false;
        });
    }
}
