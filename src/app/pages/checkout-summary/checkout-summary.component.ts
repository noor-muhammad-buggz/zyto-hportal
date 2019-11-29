import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { GlobalState } from '../../global.state';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ZytoService } from '../../services/zyto.service';
import * as moment from 'moment';
import * as _ from 'lodash';

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
  selector: 'app-checkout-summary',
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.scss'],
})
export class CheckoutSummaryComponent implements OnInit, AfterViewInit {
  clientId: any;
  sessionId: any;
  pendingSaleOrderId: any;
  pendingSaleOrderData: any;
  distributedItem: any;

  countrylist: any;
  states: any;

  selectedMonth: any = 0;
  months: any[] = [];
  monthsTemp: any[] = [];
  selectedYear: any;
  years: any[] = [];

  shippingForm: FormGroup;
  paymentForm: FormGroup;
  paymentFormToken: FormGroup;
  invalidDate: any;
  sameShipping: boolean = false;
  shippingValid: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public globalState: GlobalState,
    private zytoService: ZytoService,
    private fb: FormBuilder,
    private ngzone: NgZone
  ) {

    this.globalState.showFullLoader = true;
    this.globalState.showLoader = true;
    this.globalState.showSidebar = false;
    Stripe.setPublishableKey('pk_test_NswoegRz9KkyVozquytQOcvN');
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('Params:', params);
      this.clientId = params['id'];
      this.sessionId = params['sid'];
      this.pendingSaleOrderId = params['sale-order-id'];
    });

    this.shippingForm = this.fb.group({
      Addressee: ['', Validators.required],
      Phone: ['', Validators.required],
      Email: ['', Validators.required],
      Address: this.fb.group({
        Line1: ['', Validators.required],
        Line2: ['', Validators.nullValidator],
        City: ['', Validators.required],
        Province: ['', Validators.required],
        PostalCode: ['', Validators.nullValidator],
        Country: ['', Validators.required],
      }),
    });
    let expDate = new Date();
    this.paymentForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Phone: ['', Validators.required],
      Address: this.fb.group({
        Line1: ['', Validators.required],
        Line2: ['', Validators.nullValidator],
        City: ['', Validators.required],
        Province: ['', Validators.required],
        PostalCode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
        Country: ['', Validators.required],
      }),
      Type: ['MasterCard', Validators.required],
      Number: ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern('^[0-9]*$')])],
      ExpirationDate: ['', Validators.compose([Validators.required])],
      Verification: ['', Validators.required],
      StripeToken: ['', Validators.nullValidator],
    },{ validator: expiryValidation });




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

    this.zytoService
      .GetSalesrdersByIdWithDetail(this.pendingSaleOrderId)
      .subscribe(response => {
        let date = moment.utc(response.Client.AggregateInfo.CreatedDate).local();
        this.globalState.currentPageSubTitle = `${response.Client.PersonInfo.Name.FirstName} ${response.Client.PersonInfo.Name.LastName} | ${date.format('MM/DD/YYYY')}`;

        this.pendingSaleOrderData = response.SalesOrder;
        this.pendingSaleOrderData.LineItems.forEach(item => {
          const selectedItem = _.find(response.DistributorProducts, function (o: any) {
            return o.Id == item.DistributorProduct.Id;
          });
          item.Name = (selectedItem) ? selectedItem.Name : item.DistributorProduct.Id;
          item.detail = selectedItem;
          this.globalState.showSidebar = false;
        });

        console.log('this.pendingSaleOrderData:', this.pendingSaleOrderData);

        this.shippingForm.patchValue(this.pendingSaleOrderData.ShipTo);
        if (
          this.pendingSaleOrderData.ShipTo &&
          this.pendingSaleOrderData.ShipTo.Address &&
          this.pendingSaleOrderData.ShipTo.Address.Country
        ) {
          this.getStates(this.pendingSaleOrderData.ShipTo.Address.Country);
        }
        this.globalState.showFullLoader = false;
        this.globalState.showLoader = false;

      });
    this.globalState.showLoader = false;
    this.countrylist = [{ Name: 'United States', Id: 'US' }];
    //this.country = this.countrylist[0].Id;
  }

  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'checkout-summary';
    this.globalState.currentPageTitle = 'Your Cart';
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

  onShippingSubmit(value, shippingBtn) {
    for (const c in this.shippingForm.controls) {
      console.log(typeof this.shippingForm.controls[c]);
      this.shippingForm.controls[c].markAsTouched();
    }
    const myGroupControls = <FormGroup>this.shippingForm.controls['Address'];
    for (const c in myGroupControls.controls) {
      myGroupControls.controls[c].markAsTouched();
    }

    if (this.shippingForm.valid) {
      const postData = { ShipTo: value };
      this.globalState.showFullLoader = true;
      this.globalState.showLoader = true;
      this.zytoService
        .changeShippingTo(this.pendingSaleOrderId, postData)
        .subscribe(response => {
          // this.pendingSaleOrderData = response;
          this.globalState.showFullLoader = false;
          this.globalState.showLoader = false;
          shippingBtn.click();
          this.shippingValid = true;
          this.paymentForm.patchValue({
            Email: response.ShipTo.Email,
            Phone: response.ShipTo.Phone,
          });
          jQuery('html, #paymentinfo').animate({ scrollTop: 100 }, { duration: 5 });
        }, error => {
          this.globalState.showMessage('error', error.Message, 'Error');
          this.globalState.showFullLoader = false;
          this.globalState.showLoader = false;
        });
    } else {
      let el = $('.ng-invalid:not(form):first').parent().parent().parent();
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
        this.globalState.showFullLoader = false;
      });
    }

  }

  onPaymentSubmit(postData) {

    let self = this;
    for (const c in this.paymentForm.controls) {
      console.log(typeof this.paymentForm.controls[c]);
      this.paymentForm.controls[c].markAsTouched();
    }
    const myGroupControls = <FormGroup>this.paymentForm.controls['Address'];
    for (const c in myGroupControls.controls) {
      myGroupControls.controls[c].markAsTouched();
    }
    console.log(self.paymentForm);
    if (self.paymentForm.valid) {
      let expiry = this.paymentForm.get('ExpirationDate').value.split('/');
      const card = {
        number: this.paymentForm.get('Number').value,
        name: this.paymentForm.get('Name').value,
        address_line1: this.paymentForm.get('Address').get('Line1').value,
        address_city: this.paymentForm.get('Address').get('City').value,
        address_state: this.paymentForm.get('Address').get('Province').value,
        address_zip: this.paymentForm.get('Address').get('PostalCode').value,
        address_country: this.paymentForm.get('Address').get('Country').value,
        exp_month : ((expiry[0]) ? expiry[0] : ''),
        exp_year : ((expiry[1]) ? expiry[1] : ''),
        cvc: this.paymentForm.get('Verification').value
      };
      this.globalState.showFullLoader = true;
      this.globalState.showLoader = true;
    
      Stripe.card.createToken(card,(status, response) => {
        console.log("STRIPE STATUS IS : ", status);
        console.log("STRIPE RESPONSE IS : ", response);
        this.ngzone.run(() => {
          if(status == 200){
            self.paymentForm.controls['StripeToken'] = response.id;
            self.zytoService
              .SaleOrderPayment(self.pendingSaleOrderId, {StripeToken : response.id})
              .subscribe(response => {
                self.globalState.showMessage('success', 'Your order has been submitted successfully.', 'Success');
                self.router.navigate(['/pages/client/', self.clientId, 'sessions', self.sessionId, 'checkout-complete', self.pendingSaleOrderId]);
              }, error => {
                self.globalState.showMessage('error', error.Message, 'Error');
                self.globalState.showFullLoader = false;
                self.globalState.showLoader = false;
              });
            } else {
              self.globalState.showMessage('error', (response && response.error && response.error.message) ? response.error.message : 'Error in making payment.','Error');
              self.globalState.showFullLoader = false;
              self.globalState.showLoader = false;
          }
        });
        
        // } else {
        //   let el = $('.ng-invalid:not(form):first').parent().parent().parent();
        //   $('html,body').animate({scrollTop: (el.offset().top - 100)}, 'slow', () => {
        //       el.focus();
        //       self.globalState.showFullLoader = false;
        //       self.globalState.showLoader = false;
        //   });
        // }
      }, error => {
        console.log(error);
        
      });
    }
    else {
      let el = $('.ng-invalid:not(form):first').parent().parent().parent();
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
        this.globalState.showFullLoader = false;
        this.globalState.showLoader = false;
      });
    }

  }

  
}
