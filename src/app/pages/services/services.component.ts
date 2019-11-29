import { Component, OnInit, AfterViewInit, Self } from '@angular/core';
import { GlobalState } from "../../global.state";
import { ZytoService } from '../../services/zyto.service';
import { ZytoScanService } from '../../services/zyto-scan.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as _ from "lodash";

@Component({
    selector: "app-services",
    templateUrl: "./services.component.html",
    styleUrls: ["./services.component.scss"]
})
export class ServicesComponent implements OnInit, AfterViewInit {
    services: any[];
    myServices: any[];
    serviceForm: FormGroup;
    continuationToken: any;
    TotalRecord: any;
    throttle = 50;
    scrollDistance = 0;
    scrollUpDistance = 2;
    direction = '';

    constructor(public globalState: GlobalState,
        private zytoService: ZytoService,
        private zytoScanService: ZytoScanService,
        private fb: FormBuilder,
        public router: Router) {
        this.services = [];
    }

    ngOnInit() {

      this.serviceForm = this.fb.group({
        'ServiceIds': this.fb.array([]) ,
      });
      // this.zytoScanService.GetAllVirtual('95b913c274534c188c912362004ee4bc', '50', '').subscribe(response => {
      //   let headers = response.headers;
      //   this.continuationToken = headers.get('continuation-token');
      //   console.log(headers);my
      //   response = response.json();
      //   this.globalState.showLoader = false;
      // });
      
      let servicesArray = <FormArray>this.serviceForm.controls.ServiceIds;
      this.zytoService.GetservicesByAccountId().subscribe(x => {
        this.myServices = x.ServiceIds;
        console.log(this.myServices);
        this.zytoScanService.GetAllVirtual('95b913c274534c188c912362004ee4bc', '50', '').subscribe(response => {
          let headers = response.headers;
          this.continuationToken = headers.get('continuation-token');
          console.log(headers);
          x = response.json();
          this.services = x;
          this.services.forEach(element => {
            if(this.myServices){
              if(this.myServices.indexOf(element.Id) > -1){
                element['checked'] = true;
                servicesArray.push(new FormControl(element.Id));
              }
            }
          });
          console.log(this.services);
          this.globalState.showLoader = false;
        },error =>{
          this.globalState.showLoader = false;
        });
      },error =>{
        this.globalState.showLoader = false;
      });

      // this.serviceForm.controls['services'].patchValue('');
    }
    serviceSubmit(value: any){
      var self = this;
      this.globalState.showLoader = true;
      console.log(value);
      this.zytoService.ChangeServiceId(value).subscribe( x => {
        this.globalState.showMessage('success','Services Saved Successfully','Services')
        self.router.navigate(['/pages/account']);
        this.globalState.showLoader = false;
      },error => {
        this.globalState.showMessage('error',error.Message,'Error');
        this.globalState.showLoader = false;
      })
    }

    ngAfterViewInit() {
        console.log("in ngAfterViewInit");
        this.globalState.currentPage = "My-Services";
        this.globalState.currentPageTitle = "My Services";
        let profile = localStorage.getItem("userProfile")
            ? JSON.parse(localStorage.getItem("userProfile"))
            : {};
        if (profile && profile.user_metadata) {
            this.globalState.currentPageSubTitle = profile.user_metadata.name;
        }
    }

    onChange(id:string, isChecked: boolean) {
      const servicesArray = <FormArray>this.serviceForm.controls.ServiceIds;

      if(isChecked) {
        servicesArray.push(new FormControl(id));
      } else {
        let index = servicesArray.controls.findIndex(x => x.value == id)
        servicesArray.removeAt(index);
      }
    }

    onScrollDown() {
      const servicesArray = <FormArray>this.serviceForm.controls.ServiceIds;
      if(this.continuationToken != null){
        this.zytoScanService.GetAllVirtual('95b913c274534c188c912362004ee4bc', '50', this.continuationToken).subscribe(response => {
          let headers = response.headers;
          this.continuationToken = headers.get('continuation-token');
          console.log(headers);
          const x = response.json();
          // this.services = x;
          x.forEach(element => {
            if(this.myServices){
              if(this.myServices.indexOf(element.Id) > -1){
                element['checked'] = true;
                servicesArray.push(new FormControl(element.Id));
              }
            }
          });
          // console.log(this.services);
          // this.globalState.showLoader = false;
            x.forEach(element => {
              this.services.push(element);
            });

            this.globalState.showLoader = false;
          });
          console.log(this.services);
        };
      }
}
