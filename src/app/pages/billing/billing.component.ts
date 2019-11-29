import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoService } from '../../services/zyto.service';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Response } from "@angular/http";

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, AfterViewInit {
    customerForm: FormGroup;
    selectedMonth: any = 0;
    months: any[] = [];
    monthsTemp: any[] = [];
    selectedYear: any;
    years: any[] = [];
    countrylist: any;
    states: any;
    cardInfo: any;
    constructor(
        public globalState: GlobalState,
        public zytoService: ZytoService,
        public fb: FormBuilder,
    ) {
        this.globalState.showLoader = true;
        this.customerForm = this.fb.group({
            // 'contact': this.fb.group({
            //     'ContactInfo': this.fb.group({
            //         "Phone": ['', Validators.required],
            //         "Email": ['', Validators.required],
            //         "Fax": ['', Validators.required],
            //         "Url": ['', Validators.required],
            //         "DefaultShippingAddress": this.fb.group({
            //             "Addressee": ['', Validators.required],
            //             "Address1": ['', Validators.required],
            //             "Address2": ['', Validators.required],
            //             "City": ['', Validators.required],
            //             "State": ['', Validators.required],
            //             "Country": ['', Validators.required],
            //             "Zip": ['', Validators.required],
            //             "Phone": ['', Validators.required]
            //         }),
            //         "DefaultBillingAddress": this.fb.group({
            //             "Addressee": ['', Validators.required],
            //             "Address1": ['', Validators.required],
            //             "Address2": ['', Validators.required],
            //             "City": ['', Validators.required],
            //             "State": ['', Validators.required],
            //             "Country": ['', Validators.required],
            //             "Zip": ['', Validators.required],
            //             "Phone": ['', Validators.required]
            //         }),
            //     }),
            // }),
            // 'CreditCard': this.fb.group({
            "Default": [true, Validators.required],
            "NameOnCard": ['', Validators.required],
            "Number": ['', Validators.compose([Validators.required,Validators.minLength(16),Validators.maxLength(16),Validators.pattern('^[0-9]*$')])],
            "ExpirationDate": ['', Validators.required],
            "Verification": ['', Validators.required],
            "UseAvsCheck": [false, Validators.required],
            "ChargeWithMinimumAmount": [false, Validators.required],
            "BillingAddress": this.fb.group({
                "Addressee": ['abc', Validators.nullValidator],
                "Address1": ['', Validators.required],
                "Address2": ['', Validators.nullValidator],
                "City": ['', Validators.required],
                "State": ['', Validators.required],
                "Country": ['', Validators.required],
                "Zip": ['', Validators.required],
                "Phone": ['', Validators.required],
            })
            // })
        });
    }

    ngOnInit() {
        const account = JSON.parse(localStorage.getItem('accountDetail'));
        if(account.CustomerId){
            this.zytoService.GetCustomerByCustomerId(account.CustomerId, true).subscribe(resp => {
                console.log(resp);
                this.cardInfo = _.filter( resp.Model.CreditCards, function (o: any) { return (o.Default == true); })[0];
                this.customerForm.patchValue({
                    "Default": this.cardInfo.Default,
                    "NameOnCard": this.cardInfo.NameOnCard,
                    "ExpirationDate": this.cardInfo.ExpirationDate,
                    "Addressee": 'abc',
                });
            })
        } else {
            this.globalState.showMessage('error','Customer Id not found','Error');
        }
        this.countrylist = [{ Name: 'United States', Id: 'US' }];

        this.months = moment.months();
        const monthsTemp = moment().format('M');
        console.log(Number(monthsTemp));
        for (let i = Number(monthsTemp) - 1; i <= 11; i++) {
            this.monthsTemp.push(i);
        }
        if (this.monthsTemp) {
            this.selectedMonth = this.monthsTemp[0];
        }

        console.log('this.monthsT:', this.monthsTemp);
        console.log('this.months:', this.months);
        const start_year = new Date().getFullYear();
        for (let i = start_year; i <= start_year + 20; i++) {
            this.years.push(i);
        }
        if (this.years) {
            this.selectedYear = this.years[0];
        }
        console.log('this.years:', this.years);
        this.onDateChange();

    }

    ngAfterViewInit() {
        console.log("in ngAfterViewInit");
        this.globalState.currentPage = "Billing-info";
        this.globalState.currentPageTitle = "Billing Info";
        let profile = localStorage.getItem("userProfile")
            ? JSON.parse(localStorage.getItem("userProfile"))
            : {};
        if (profile && profile.user_metadata) {
            this.globalState.currentPageSubTitle = profile.user_metadata.name;
        }
        this.globalState.showLoader = false;
    }

    onCountryChange($event: any) {
        console.log('in onCountryChange');
        console.log($event);
        this.getStates($event.target.value);
    }

    getStates(country) {
        const selectedCountry = _.find(this.countrylist, function (o: any) {
            return o.Name == country;
        });
        console.log(selectedCountry);
        if (selectedCountry)
            this.zytoService
                .GetCountryStates(selectedCountry.Id)
                .subscribe(response => {
                    this.states = response;
                });
    }

    onDateChange() {
        this.monthsTemp = [];
        if (this.selectedYear == new Date().getFullYear()) {
            const monthsTemp = moment().format('M');
            console.log(Number(monthsTemp));
            for (let i = Number(monthsTemp) - 1; i <= 11; i++) {
                this.monthsTemp.push(i);
            }
        } else {
            for (let i = 0; i <= 11; i++) {
                this.monthsTemp.push(i);
            }
        }


        if (this.customerForm && this.customerForm.controls['ExpirationDate']) {
            let date: any = new Date(this.selectedYear, this.selectedMonth, 1);
            date = moment(date).utc(true).toDate();
            console.log('date:', date);
            this.customerForm.controls['ExpirationDate'].patchValue(date);
        }
    }
    customerSubmit(value) {
        console.log(this.customerForm);
        for (const c in this.customerForm.controls) {
            console.log(typeof this.customerForm.controls[c]);
            this.customerForm.controls[c].markAsTouched();
        }
        const myGroupControls = <FormGroup>this.customerForm.controls['BillingAddress'];
        for (const c in myGroupControls.controls) {
          myGroupControls.controls[c].markAsTouched();
        }
        if(this.customerForm.valid){
            this.globalState.showLoader = true;
            const account = JSON.parse(localStorage.getItem('accountDetail'));
            this.zytoService.ChangeCreditCard(value, account.CustomerId).subscribe(response => {
                console.log(response);
                this.globalState.showLoader = false;
            }, error => {
                this.globalState.showMessage('error',error.Message,'Error');
                this.globalState.showLoader = false;
            });

        } else {
            let el = $('.ng-invalid:not(form):first').parent().parent().parent();
            $('html,body').animate({scrollTop: (el.offset().top - 100)}, 'slow', () => {
                el.focus();
                this.globalState.showLoader = false;
            });
        }
    }
}
