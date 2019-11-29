import { Component, OnInit, NgZone } from '@angular/core';
import { GlobalState } from '../../global.state';
import { ActivatedRoute, Router } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

import * as moment from "moment";
declare var Stripe: any;

const expiryValidation = (control: AbstractControl): { [key: string]: boolean } => {
    const expdate = control.get('ExpirationDate');
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (expdate.value) {
        if (regex.test(expdate.value)) {
            let expiry = control.get('ExpirationDate').value.split('/');
            let date = moment().utc(true).toDate();
            let year = parseInt(date.getFullYear().toString().substring(2));
            let month = date.getMonth() + 1;
            if (parseInt(expiry[1]) < year) {
                return { invalidExpiry: true };
            }
            else if (parseInt(expiry[1]) == year && parseInt(expiry[0]) < month) {
                return { invalidExpiry: true };
            }
            else {
                return null;
            }
        }
        else {
            return (regex.test(expdate.value)) ? null : { invalidExpiry: true };
        }
    }
    else {
        return null;
    }
};

@Component({
    selector: 'app-plan-upgrade',
    templateUrl: './plan-upgrade.component.html',
    styleUrls: ['./plan-upgrade.component.scss', '../../theme/sass/as_custom.css']
})
export class PlanUpgradeComponent implements OnInit {
    accountID: any = localStorage.getItem('accountId');
    accountDetail: any;
    productInfo: any;
    cardForm: any;
    expiryDate: any = moment().add('1', 'month');

    constructor(
        public globalState: GlobalState,
        private route: ActivatedRoute,
        public router: Router,
        private zytoService: ZytoService,
        private fb: FormBuilder,
        private _zone: NgZone
    ) {
        // this.globalState.showLoader = true;
    }


    ngOnInit() {
        
        this.globalState.showLoader = true;
        this.zytoService
            .GetAccountDetail()
            .subscribe(response => {
                this.globalState.showLoader = false;
                this.accountDetail = response;
                this.globalState.currentPage = 'account-plan-upgrade';
                this.globalState.currentPageTitle = `${this.accountDetail.Account.Name}`;
                this.globalState.currentPageSubTitle = `ACCOUNT PLAN - UPGRADE`;
            },
                error => {
                });

        this.globalState.showLoader = true;
        this.zytoService
            .GetSoftwareProductsWithDetails()
            .subscribe(response => {
                this.globalState.showLoader = false;
                this.productInfo = response;
            },
                error => {
                    this.globalState.showLoader = false;
                });

        this.cardForm = this.fb.group({
            Name: ['', Validators.required],
            Line1: ['', Validators.required],
            City: ['', Validators.required],
            Province: ['', Validators.required],
            PostalCode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
            Number: ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern('^[0-9]*$')])],
            ExpirationDate: ['', Validators.compose([Validators.required])],
            Verification: ['', Validators.required],
        }, { validator: expiryValidation });
    }

    upgradeSubscription() {
        for (const c in this.cardForm.controls) {
            this.cardForm.controls[c].markAsTouched();
        }

        if (this.cardForm.valid) {
            let expiry = this.cardForm.get('ExpirationDate').value.split('/');
            Stripe.setPublishableKey('pk_test_NswoegRz9KkyVozquytQOcvN');
            const card = {
                name: this.cardForm.get('Name').value,
                address_line1: this.cardForm.get('Line1').value,
                address_zip: this.cardForm.get('PostalCode').value,
                address_city: this.cardForm.get('City').value,
                address_state: this.cardForm.get('Province').value,
                number: this.cardForm.get('Number').value,
                exp_month: ((expiry[0]) ? expiry[0] : ''),
                exp_year: ((expiry[1]) ? expiry[1] : ''),
                cvc: this.cardForm.get('Verification').value
            };

            // let that = this;
            Stripe.card.createToken(card, (status, response) => {
                this._zone.run(() => {
                    if (status !== 200) {
                        this.globalState.showMessage("error", response["error"].message, '');
                    }
                    else {
                        this.globalState.showLoader = true;
                        this.zytoService
                            .UpgradeAccountSubscription(this.accountID, response["id"])
                            .subscribe(response => {
                                this.globalState.showLoader = false;
                                this.globalState.showMessage("success", "Your subscription upgraded successfully", 'Success');
                                this.router.navigate(["/pages/account", this.accountID, 'account-plan']);
                            }, error => {
                                this.globalState.showLoader = false;
                                this.globalState.showMessage("error", "Unable to upgrade subscription at the moment", 'Error');
                            });
                    }
                });
            });
        }
    }

    ngAfterViewInit() {
        console.log("in ngAfterViewInit");
        this.globalState.currentPage = "plan-upgrade";
        this.globalState.currentPageTitle = "Accounr Plan Upgrade";
        let profile = localStorage.getItem("userProfile")
            ? JSON.parse(localStorage.getItem("userProfile"))
            : {};
        if (profile && profile.user_metadata) {
            this.globalState.currentPageSubTitle = profile.user_metadata.name;
        }
    }
}

