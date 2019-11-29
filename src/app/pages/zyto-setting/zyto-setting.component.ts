import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GlobalState } from '../../global.state';
import { ZytoScanService } from '../../services/zyto-scan.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

// export class NgbdModalContent {
//   deviceId;
//   constructor(public activeModal: NgbActiveModal) { }
// }

@Component({
  selector: 'app-zyto-setting',
  templateUrl: './zyto-setting.component.html',
  styleUrls: ['./zyto-setting.component.scss'],
})
export class ZytoSettingComponent implements OnInit, OnDestroy, AfterViewInit {
  devices = [];
  device: any;
  edit: any;
  addDevice: FormGroup;
  formModel: any;
  errorMessage: any;
  editMode: boolean = false;
  installStep: any = 1;
  temp: any;
  tempStatus: any;
  scanId: any;
  noti: any;
  notification: any;
  calibrated: any;
  status: any;
  startscan: any;
  progress: any = 0;
  contactStates: any = Array[5];
  contactTouches: any = 0;
  macApp: any = environment.downloads.scanAppMacUrl;
  windowApp: any = environment.downloads.scanAppWindowsUrl;

  @ViewChild('installDriversModal') installDriversModal: ElementRef;
  @ViewChild('deviceFieldInput') deviceFieldInput: ElementRef;


  constructor(private zytoScanService: ZytoScanService, fb: FormBuilder,
    public activeModal: NgbActiveModal, public modalService: NgbModal,
    public globalState: GlobalState, public router: Router) {

    this.addDevice = fb.group({
      name: new FormControl(),
      deviceId: ['', Validators.required],
    });
  }

  ngOnInit() {
    // this.devices.push({
    //   id:'alskdfjlk-3453453fdg-435345',
    //   name:'Device 1'
    // });
    this.zytoScanService.GetAllDevices().subscribe(response => {
      this.devices = response;
      if (response.length !== 0) {
        this.scanId = response[0].Id;
        this.checkDeviceStatus();
      } else {
        if (this.startscan)
          this.startscan.unsubscribe();
      }
      this.globalState.showLoader = false;
    },
      error => {
        this.globalState.showLoader = false;
        this.errorMessage = <any>error
      });

    // this.zytoScanService.addDevice().subscribe(response => {});
    // this.zytoScanService.registerDevice().subscribe(response => {});

    //this.openDriversPopop();
  }
  ngOnDestroy() {
    if (this.startscan) {
      this.startscan.unsubscribe();
    }

    this.errorMessage = '';
    this.status = '';
    this.temp = '';
    this.notification = '';
  }
  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'My-Devices';
    this.globalState.currentPageTitle = 'My Devices';
    const profile = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile')) : {};
    if (profile && profile.user_metadata.name) {
      this.globalState.currentPageSubTitle = profile.user_metadata.name;
    } else {
      this.globalState.currentPageSubTitle = profile.nickname;
    }
  }

  editName() {
    this.edit = true;
  }
  open(content) {
    this.modalService.open(content, { windowClass: 'a_setting_modal' }).result.then((result) => {

    }, (reason) => {
      this.edit = false;
      this.addDevice.reset();
    });
  }

  onSubmit(values: any, closeModal) {
    this.formModel = this.addDevice.value;
    console.dir(this.formModel);
    const self = this;
    for (const c in this.addDevice.controls) {
      console.log(typeof this.addDevice.controls[c]);
      this.addDevice.controls[c].markAsTouched();
    }

    if (this.addDevice.valid) {
      this.globalState.showLoader = true;
      if (this.edit) {

        this.zytoScanService.ChangeDeviceName(this.devices[0].Id, this.formModel.name).subscribe(x => {
          console.dir(x);

          this.zytoScanService.GetAllDevices().subscribe(response => {
            this.devices = response;
            this.edit = false;
            if (response.length !== 0) {
              this.scanId = response[0].Id;
              this.checkDeviceStatus();
            } else {
              if (this.startscan) {
                this.startscan.unsubscribe();
              }
            }
            this.addDevice.reset();
            this.globalState.showLoader = false;
          }, error => {
            this.globalState.showLoader = false;
            this.globalState.showMessage('error', error.Message, 'Error')
          });

        }, error => {
          this.globalState.showLoader = false;
          this.globalState.showMessage('error', error.Message, 'Error')
        });
      } else {
        this.edit = false;
        this.zytoScanService.GetDeviceById(this.formModel.deviceId).subscribe(response => {
          // Device Exist
          if (response) {
            this.zytoScanService.registerDevice(this.formModel.deviceId, this.formModel.name)
              .subscribe(s => {
                console.dir(s);
                this.zytoScanService.GetAllDevices().subscribe(res => {
                  this.globalState.showLoader = false;
                  this.devices = res;
                  if (res.length !== 0) {
                    this.scanId = res[0].Id;
                    this.checkDeviceStatus();
                  } else {
                    if (this.startscan) {
                      this.startscan.unsubscribe();
                    }
                  }
                }, error => {
                  this.globalState.showLoader = false;
                  this.globalState.showMessage('error', error.json().Message, 'Error')
                });
              }, error => {
                this.globalState.showLoader = false;
                this.globalState.showMessage('error', error.json().Message, 'Error')
              });
          }
          this.edit = false;
        }, error => {
          console.log(error.json());
          // Device does not exist
          if (error.status === 422) {
            this.globalState.showMessage('error', error.json().Message, 'Error')
            this.globalState.showLoader = false;
          } else if (error.status === 404) {
            let name = JSON.parse(localStorage.getItem('userProfile'));
            name = `${(name.user_metadata.given_name) ? name.user_metadata.given_name : name.nickname}'s Hand Cradle`;
            this.zytoScanService.addDevice(this.formModel.deviceId, name)
              .subscribe(s => {
                console.dir(s);
                this.globalState.showLoader = false;
                this.zytoScanService.GetAllDevices().subscribe(res => {
                  this.devices = res;
                  if (res.length !== 0) {
                    this.scanId = res[0].Id;
                    this.checkDeviceStatus();
                  } else {
                    if (this.startscan) {
                      this.startscan.unsubscribe();
                    }
                  }
                  this.addDevice.reset();
                }, error => {
                  this.globalState.showLoader = false;
                  this.globalState.showMessage('error', error.json().Message, 'Error')
                });
              }, error => {
                console.log(error.json());
                  if (error.status === 422) {
                    this.globalState.showMessage('error', error.json().Message, 'Error')
                    this.globalState.showLoader = false;
                  }
                },
            );
          }
        });
      }
    } else {
      console.log(this.addDevice);
    }
    console.dir(this.formModel);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      // event.confirm.resolve();
    } else {
      // event.confirm.reject();
    }
  }
  onEdit() {
    this.globalState.showLoader = true;
    this.zytoScanService.GetDeviceId()
      .subscribe(s => {

        console.dir(s);
        this.addDevice.patchValue({
          name: s[0].Name,
          deviceId: s[0].Id,
        });
        this.edit = true;
        //this.deviceFieldInput.nativeElement.focus();
        this.globalState.showLoader = false;
        // modalRef.componentInstance.deviceId = 'World';
      },
        error => this.errorMessage = <any>error);

  }
  cancle() {
    this.edit = false;
  }
  registerDevice(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.zytoScanService.registerDevice(this.formModel.deviceId, this.formModel.name)
        .subscribe(s => { console.dir(s); this.device = s[0]; }, error => {
          this.globalState.showLoader = false;
          this.globalState.showMessage('error', error.Message, 'Error')
        });
    } else {
      // event.confirm.reject();
    }

  }

  unregisterDevice(id): void {
    if (window.confirm('Are you sure you want to Unpair?')) {
      this.globalState.showLoader = true;
      this.zytoScanService.unregisterDevice(id).subscribe(
        s => {
          this.zytoScanService.GetAllDevices().subscribe(res => {
            this.devices = res;
            if (res.length !== 0) {
              this.scanId = res[0].Id;
              this.checkDeviceStatus();
            } else {
              this.errorMessage = '';
              this.startscan.unsubscribe();
            }
            this.globalState.showLoader = false;
          }, error => {
            this.globalState.showLoader = false;
            this.globalState.showMessage('error', error.Message, 'Error')
          });
        }, error => {
          this.globalState.showLoader = false;
          this.globalState.showMessage('error', error.Message, 'Error')
        });
    } else {
      // event.confirm.reject();
    }
    this.errorMessage = '';
    this.status = '';
    this.temp = '';
    this.notification = '';
  }

  nextStep() {
    if (this.installStep < 3) {
      this.installStep = this.installStep + 1;
    }
  }

  finalStep(callback) {
    callback('Close click');
    this.router.navigate(['/pages/account/device']);
  }


  openDriversPopop() {
    this.modalService.open(this.installDriversModal, { windowClass: 'a_driverInstall_modal' }).result.then((result) => {
    }, (reason) => {
      this.installStep = 1;
    });
  }


  checkDeviceStatus() {
    this.startscan = Observable.interval(2000).subscribe(xx => {
      if (this.scanId) {
        this.zytoScanService.GetDeviceStatus(this.scanId).subscribe(resp => {
          this.calibrated = resp.Calibrated;
          console.dir(resp.ContactStates);
          console.dir('Contact States');
          const t = [];
          _.forEach(resp.ContactStates, function (value, i) {
            if (value === true) {
              t.push(i);
            }
          });
          this.contactTouches = t.length;
          console.dir(this.contactTouches);
          this.contactStates = resp.ContactStates;
          console.dir(this.contactStates);
          if (this.calibrated) {
            this.notification = 'Your hand cradle is successfully connected';
            this.errorMessage = '';
            this.temp = '';
            this.status = '';
          } else {
            this.status = 'Put your hand on the cradle';
            this.errorMessage = '';
            this.temp = '';
            this.notification = '';
          }

        }, error => {
          console.dir('Device status error');
          this.errorMessage = 'Your Hand Cradle not found. Please Connect your cradle to ZYTO system';
          this.temp = 'cradle-404';
          // this.errorMessage = <any>error.Message;
          if (error.status === 404) {
            this.errorMessage = 'Your Hand Cradle not found. Please Connect your cradle to ZYTO system';
            this.temp = 'cradle-404';
            this.status = '';
            this.notification = '';
          }
        });
      } else {
        console.dir('No device Found');
        this.temp = 'no-device';
        this.zytoScanService.GetDeviceId().subscribe(reponse => {
          if (reponse && reponse[0]) {
            this.scanId = reponse[0].Id;
          } else {
            console.dir('No device Found 1');
            this.errorMessage = 'No Device is registered with this account';
            this.status = '';
            this.temp = 'no-device';
            this.notification = '';
          }
        });
      }
    });
  }

  scanning1() {
    return this.temp === 'WaitingForBiosurveyRunStart' && this.calibrated;
  }
  scan0() {
    return (this.temp === 'scanning' || this.temp === 'WaitingForBiosurveyRunCompleted' || this.temp === 'WaitingForBiosurveyRunResume') && this.calibrated;
  }
  complete() {
    return this.temp === 'complete';
  }
  placehand() {
    return this.temp === 'pause-scan' && !this.calibrated && !this.tempStatus;
  }
  calibrating() {
    return (this.temp === 'cradle-404' && this.calibrated) || (this.temp === 'pause-scan' && this.calibrated && this.notification === 'Calibrating');
  }
  noHand() {
    return this.temp === 'cradle-404' && !this.calibrated;
  }
  errorScan() {
    return this.tempStatus && !this.calibrated && (this.temp === 'pause-scan' || this.temp === 'no-hand');
  }
  NoDevice() {
    return !this.scanId && this.temp === 'no-device';
  }
  progressBar() {
    return (this.temp === 'scanning' || this.temp === 'WaitingForBiosurveyRunCompleted' || this.temp === 'WaitingForBiosurveyRunResume') && this.notification !== 'cradle-404' || (this.temp === 'complete');
    // return ( this.temp === 'pause-scan' || this.temp === 'scanning' || this.temp === 'WaitingForBiosurveyRunCompleted' || this.temp === 'WaitingForBiosurveyRunResume') && this.notification !== 'cradle-404' || (this.temp === 'complete');
  }

}
