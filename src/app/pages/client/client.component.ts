import { Component, OnInit, AfterViewInit, state } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import { NgbDatepicker, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GlobalState } from '../../global.state';
import { CalendarModule } from 'primeng/primeng';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [ZytoService],
})
export class ClientComponent implements OnInit, AfterViewInit {
  date = new Date();
  maxDate = { year: this.date.getFullYear(), month: this.date.getMonth(), day: this.date.getDay() };
  model;
  states: any;
  range: any = moment.utc().subtract(100, 'years').year() + ':' + moment.utc().year();
  maxDateValue: Date = new Date();
  statesReady: boolean = false;
  response: any = '';
  clientForm: FormGroup;
  prefix: AbstractControl;
  firstname: AbstractControl;
  middlename: AbstractControl;
  lastname: AbstractControl;
  email: AbstractControl;
  phone: AbstractControl;
  birthday: AbstractControl;
  gender: AbstractControl;
  refferedby: AbstractControl;
  cipemail: AbstractControl;
  cipphone: AbstractControl;
  ciptext: AbstractControl;
  preffered: AbstractControl;

  line1: AbstractControl;
  line2: AbstractControl;
  city: AbstractControl;
  province: AbstractControl;
  postalCode: AbstractControl;
  country: AbstractControl;

  preference: any = '';
  isReffered: boolean = true;
  isReffer: AbstractControl;

  countrylist: any;

  formSubmited: boolean;
  isSuccessful: boolean;
  isFailed: boolean;
  client: any;
  reference: any;
  id: number;
  private sub: any;
  errors: string[] = [];

  constructor(fb: FormBuilder,
    public router: Router,
    private _ZytoService: ZytoService,
    private route: ActivatedRoute,
    config: NgbDatepickerConfig,
    public globalState: GlobalState) {
    this.clientForm = fb.group({
      'firstname': ['', Validators.compose([Validators.required,this.emptySpaceValidation])],
      'middlename': ['', Validators.compose([Validators.nullValidator])],
      'lastname': ['', Validators.compose([Validators.required])],
      'birthday': [new Date(), Validators.compose([Validators.required])],
      'line1': ['', Validators.compose([Validators.required])],
      'line2': ['', Validators.compose([Validators.nullValidator])],
      'city': ['', Validators.compose([Validators.required])],
      'province': ['', Validators.compose([Validators.required])],
      'postalCode': ['', Validators.compose([Validators.required])],
      'country': ['', Validators.compose([Validators.required])],
      'gender': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])],
      'phone': ['', Validators.compose([Validators.required])],
      'refferedby': ['',Validators.compose([Validators.nullValidator])],
      'isReffer': [true, Validators.compose([Validators.nullValidator])],
      'preffered': ['Email', Validators.compose([Validators.required])],
    });



    // this.reference = (this.clientForm.controls['isReffer']) ? this.clientForm.controls['refferedby'] : '';

    this.firstname = this.clientForm.controls['firstname'];
    this.middlename = this.clientForm.controls['middlename'];
    this.lastname = this.clientForm.controls['lastname'];
    this.birthday = this.clientForm.controls['birthday'];
    this.gender = this.clientForm.controls['gender'];
    this.email = this.clientForm.controls['email'];
    this.phone = this.clientForm.controls['phone'];
    this.refferedby = this.clientForm.controls['refferedby'];
    this.isReffer = this.clientForm.controls['isReffer'];

    this.line1 = this.clientForm.controls['line1'];
    this.line2 = this.clientForm.controls['line2'];
    this.city = this.clientForm.controls['city'];
    this.province = this.clientForm.controls['province'];
    this.postalCode = this.clientForm.controls['postalCode'];
    this.country = this.clientForm.controls['country'];
    this.preffered = this.clientForm.controls['preffered'];

    this.countrylist = [{ Name: 'United States', Id: 'US' }];

    // // weekends are disabled
    // config.navigation = (date: NgbDateStruct) => {
    //     const d = new Date(date.year, date.month - 1, date.day);
    //     return d.getDay() === 0 || d.getDay() === 6;
    // };
  }


  emptySpaceValidation(c: FormControl) {
    return  (c.value.trim()  != "") ? null : {
        ValidateEmpty: {
        valid: false
      }
    };
  }

  ngAfterViewInit(): void {
    if (this.client) {
      console.log('in ngAfterViewInit');
      this.globalState.currentPage = 'client-edit';
      this.globalState.currentPageTitle = 'Edit Record';
    } else {
      console.log('in ngAfterViewInit');
      this.globalState.currentPage = 'client';
      this.globalState.currentPageTitle = 'Add A New Client';
    }
    this.globalState.showLoader = false;
  }
  ngOnInit() {
    this._ZytoService.GetCountryStates().subscribe(x => {
      this.states = x; console.dir(x);
      this.statesReady = true;

      this.updateStateField();

    });
    console.dir(this.states);
    this.route.data.forEach((data: { client: any }) => this.client = (data.client) ? data.client.Client : '');

    if (this.client) {
      localStorage.setItem('client_ETag', this.client.ETag);
      const dateb = new Date(this.client.PersonInfo.DateOfBirth);

      if (this.client.ReferredBy) {
        this.isReffered = true;
      } else {
        this.isReffered = false;
      }
      this.reference = (this.isReffered) ? this.client.ReferredBy : '';

      this.client.ContactInfo.DefaultShippingAddress = this.client.ContactInfo.DefaultShippingAddress || {};


      if (this.client.ContactInfo.Preference.Email == true) {
        this.preference = 'Email';
      } else if (this.client.ContactInfo.Preference.Text == true)
      {
        this.preference = 'Text';
      }
      this.clientForm.patchValue({
        'firstname': this.client.PersonInfo.Name.FirstName,
        'middlename': this.client.PersonInfo.Name.MiddleName,
        'lastname': this.client.PersonInfo.Name.LastName,
        'birthday': new Date(moment(this.client.PersonInfo.DateOfBirth).format()),  //dateb.getMonth()+1 + '/'+dateb.getDay()+'/'+dateb.getFullYear(),
        'gender': this.client.PersonInfo.Gender,
        'email': this.client.ContactInfo.Email,
        'phone': this.client.ContactInfo.Phone,
        'line1': (this.client.ContactInfo.DefaultShippingAddress.Line1) ? this.client.ContactInfo.DefaultShippingAddress.Line1 : '',
        'line2': (this.client.ContactInfo.DefaultShippingAddress.Line2) ? this.client.ContactInfo.DefaultShippingAddress.Line2 : '',
        'city': (this.client.ContactInfo.DefaultShippingAddress.City) ? this.client.ContactInfo.DefaultShippingAddress.City : '',
        'province': (this.client.ContactInfo.DefaultShippingAddress.Province) ? this.client.ContactInfo.DefaultShippingAddress.Province : '',
        'postalCode': (this.client.ContactInfo.DefaultShippingAddress.PostalCode) ? this.client.ContactInfo.DefaultShippingAddress.PostalCode : '',
        'country': (this.client.ContactInfo.DefaultShippingAddress.Country) ? this.client.ContactInfo.DefaultShippingAddress.Country : '',
        'refferedby': this.client.ReferredBy,
        'isReffer': this.isReffered,
        'preffered':'Email',
      });

      this.updateStateField();

    }
    this.formSubmited = false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.errors = [];
  }
  goBack() {
    const self = this;
    if (this.client) {
      self.router.navigate(['/pages/client', this.client.Id, 'client-detail']);
    } else {
      self.router.navigate(['/pages/clients']);
    }
  }
  updateStateField() {
    if (this.client && this.client.ContactInfo.DefaultShippingAddress.Province && this.states && this.states.length > 0) {
      const provinceShort = _.head(_(this.states).filter(c => c.Name == this.client.ContactInfo.DefaultShippingAddress.Province).map('Id').value());
      console.log(provinceShort);
      if (provinceShort) {
        this.province.patchValue(provinceShort);
      }
    }

    if (this.client && this.client.ContactInfo.DefaultShippingAddress.Country && this.countrylist) {
      const countryShort = _.head(_(this.countrylist).filter(c => c.Name == this.client.ContactInfo.DefaultShippingAddress.Country).map('Id').value());
      console.log(countryShort);
      if (countryShort) {
        this.country.patchValue(countryShort);
      }
    }
  }

  onSubmit(values: any): void {
    console.clear();
    console.dir(values);
    const temp = values.isReffer;
    if (temp === 'false') {
      values.refferedby = '';
      console.dir('in');
    } else {
      console.dir('else');
    }

    for (const c in this.clientForm.controls) {
      console.log(typeof this.clientForm.controls[c]);
      this.clientForm.controls[c].markAsTouched();
    }

    const myGroupControls = <FormGroup>this.clientForm.controls['birthday'];
    for (const c in myGroupControls.controls) {
      myGroupControls.controls[c].markAsTouched();
    }
    console.log(this.clientForm);
    // console.dir(values);
    if (this.clientForm.valid) {
      this.globalState.showLoader = true;
      this.formSubmited = true;
      this.isSuccessful = false;
      this.isFailed = false;
      this.errors = [];
      const self = this;
      // console.clear();
      values.refferedby = (values.isReffer) ? values.refferedby : '';
      console.dir(moment(values.birthday));
      // values.birthday = moment.utc(values.birthday).toISOString();
      let d = moment(values.birthday)
      let utcDate = new Date(Date.UTC(d.year(), d.month(), d.date()));
      console.dir(utcDate.toUTCString());
      values.birthday = utcDate.toUTCString();
      if (this.client) {
        let status = false;
        console.log(this.client);
        console.log(values);
        this._ZytoService.ChangeClientUpdate(this.client.Id,values).subscribe(x => {
          this.response = x;
          localStorage.setItem('client_ETag', x.ETag);
          this.formSubmited = false;
          this.globalState.showMessage('success', 'Client Successfully Updated', 'Client Updated');
          //self.router.navigate(['/dashboard']);
          this.router.navigate(['/pages/client', x.Id, 'client-detail']);
        });
        // console.dir(moment(values.birthday).toISOString());
        // console.dir(moment.utc(this.client.PersonInfo.DateOfBirth).toISOString());
        // if (this.client.PersonInfo.Name.FirstName != values.firstname || this.client.PersonInfo.Name.LastName != values.lastname
        //   || this.client.PersonInfo.Gender != values.gender || moment(values.birthday).toISOString() != moment.utc(this.client.PersonInfo.DateOfBirth).toISOString() || this.client.ContactInfo.Email != values.email
        //   || this.client.ContactInfo.Phone != values.phone || this.client.ContactInfo.Preference.Email != values.cipemail || this.client.ContactInfo.Preference.Text != values.ciptext
        //   || this.client.ContactInfo.DefaultShippingAddress.City != values.city || this.client.ContactInfo.DefaultShippingAddress.PostalCode != values.postalCode
        //   || this.client.ContactInfo.DefaultShippingAddress.Line1 != values.line1 || this.client.ContactInfo.DefaultShippingAddress.Line2 != values.line2
        //   || this.client.ReferredBy != values.refferedby) {

        //   if (this.client.PersonInfo.Name.FirstName != values.firstname || this.client.PersonInfo.Name.LastName != values.lastname || this.client.PersonInfo.Gender != values.gender || moment(values.birthday).toISOString() != moment.utc(this.client.PersonInfo.DateOfBirth).toISOString()) {
        //     status = false;
        //     this.personalInfoUpdate(values);
        //   }
        //   else if (this.client.ContactInfo.Email != values.email || this.client.ContactInfo.Phone != values.phone || this.client.ContactInfo.Preference.Email != values.cipemail || this.client.ContactInfo.Preference.Text != values.ciptext || this.client.ContactInfo.DefaultShippingAddress.City != values.city || this.client.ContactInfo.DefaultShippingAddress.PostalCode != values.postalCode || this.client.ContactInfo.DefaultShippingAddress.Line1 != values.line1 || this.client.ContactInfo.DefaultShippingAddress.Line2 != values.line2) {
        //     // || this.client.ContactInfo.DefaultShippingAddress.Province != values.province || this.client.ContactInfo.DefaultShippingAddress.Country != values.country
        //     this.contactInfoUpdate(values);
        //   }
        //   else if (this.client.ReferredBy != values.refferedby) {
        //     this.referByUpdate(values);
        //   }
        //   // this.globalState.showLoader = false;
        //   // this.globalState.showMessage('success', 'Client Successfully Updated', 'Client Updated');
        //   // setTimeout(() => {
        //   //   self.router.navigate(['/pages/client', this.client.Id, 'client-detail']);
        //   // }, 500);
        // } else {
        //   this.globalState.showLoader = false;
        // }

      } else {
        console.log(values);
        this._ZytoService.CreateClient(values)
          .subscribe(x => {
            this.response = x; console.dir(x.ETag);
            localStorage.setItem('eTag', x.ETag);
            this._ZytoService.AssociateClient(x.Id).subscribe(y => {
              //this.response = x;
              localStorage.setItem('eTag', y.ETag);

              this.formSubmited = false;

              this.globalState.showMessage('success', 'Client Successfully Created', 'Client Created');

              //self.router.navigate(['/dashboard']);
              self.router.navigate(['/pages/client', x.Id, 'client-detail']);
            });
          }, error => {
            this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Exception.Message, 'Error');
            this.globalState.showLoader = false;
          });
      }

    } else {
      let el = $('.ng-invalid:not(form):first').parent().parent().parent();
      $('html,body').animate({scrollTop: (el.offset().top - 100)}, 'slow', () => {
          el.focus();
          this.globalState.showLoader = false;
      });
    }
  }
  // personalInfoUpdate(values: any) {
  //   this._ZytoService.ChangeClientPersonal(this.client.Id, values)
  //     .subscribe(x => {
  //       this.response = x; console.dir(x.ETag);
  //       localStorage.setItem('client_ETag', x.ETag);
  //       if (this.client.ContactInfo.Email != values.email || this.client.ContactInfo.Phone != values.phone || this.client.ContactInfo.Preference.Email != values.cipemail || this.client.ContactInfo.Preference.Text != values.ciptext || this.client.ContactInfo.DefaultShippingAddress.City != values.city || this.client.ContactInfo.DefaultShippingAddress.PostalCode != values.postalCode || this.client.ContactInfo.DefaultShippingAddress.Line1 != values.line1 || this.client.ContactInfo.DefaultShippingAddress.Line2 != values.line2) {
  //         // || this.client.ContactInfo.DefaultShippingAddress.Province != values.province || this.client.ContactInfo.DefaultShippingAddress.Country != values.country
  //         this.contactInfoUpdate(values);
  //       } else if (this.client.ReferredBy != values.refferedby) {
  //         this.referByUpdate(values);
  //       } else {
  //         this.formSubmited = false;
  //         this.globalState.showMessage('success', 'Client Successfully Updated', 'Client Updated');
  //         //self.router.navigate(['/dashboard']);
  //         this.router.navigate(['/pages/client', x.Id, 'client-detail']);
  //       }
  //     }, error => {
  //       this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Exception.Message, 'Error');
  //       this.globalState.showLoader = false;
  //     });
  // }
  // contactInfoUpdate(values: any) {
  //   this._ZytoService.ChangeClientContact(this.client.Id, values)
  //     .subscribe(x => {
  //       this.response = x; console.dir(x.ETag);
  //       localStorage.setItem('client_ETag', x.ETag);
  //       if (this.client.ReferredBy != values.refferedby) {
  //         this.referByUpdate(values);
  //       } else {
  //         this.formSubmited = false;
  //         this.globalState.showMessage('success', 'Client Successfully Updated', 'Client Updated');
  //         //self.router.navigate(['/dashboard']);
  //         this.router.navigate(['/pages/client', x.Id, 'client-detail']);
  //       }
  //     }, error => {
  //       this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Exception.Message, 'Error');
  //       this.globalState.showLoader = false;
  //     });
  // }
  // referByUpdate(values: any) {
  //   this._ZytoService.ChangeClientRefferedBy(this.client.Id, values)
  //     .subscribe(x => {
  //       this.response = x;
  //       localStorage.setItem('client_ETag', x.ETag);
  //       this.formSubmited = false;
  //       this.globalState.showMessage('success', 'Client Successfully Updated', 'Client Updated');
  //       //self.router.navigate(['/dashboard']);
  //       this.router.navigate(['/pages/client', x.Id, 'client-detail']);
  //     }, error => {
  //       this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Exception.Message, 'Error');
  //       this.globalState.showLoader = false;
  //     });
  // }

  onSelectionChange(value) {
    console.log(value);
    console.log(typeof value);
    this.isReffered = value;
    if (value) {
      // this.isReffer = '';
    }

  }

}
