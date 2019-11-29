import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { GlobalState } from '../../global.state';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import * as _ from 'lodash';

declare var Jcrop: any;
declare var $: any;

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})

export class EditAccountComponent implements OnInit, AfterViewInit {

  accountForm: FormGroup;
  loading: boolean = false;
  countrylist: any;
  states: any = [];
  account: any = [];
  public defaultPicture = 'assets/img/app/profile/Nasta.png';
  public profile1: any;

  id = localStorage.getItem('accountId');
  url = environment.ApiBaseUrl.concat('accounts/').concat(this.id).concat('/image/upload');

  @ViewChild('imageUpload') public imageUpload: any;


  allowedMimeType = ["image/png", "image/jpeg"];
  maxFileSize = 6 * 1024 * 1024; //6 Mb
  public uploaderOptions = {
    authToken: "Bearer " + localStorage.getItem("id_token"),
    url: this.url,
    allowedMimeType: this.allowedMimeType,
    maxFileSize: this.maxFileSize,
    maxWidth: 5000,
    maxHeight: 5000,
  };

  constructor(public globalState: GlobalState, public router: Router, private zytoService: ZytoService, private fb: FormBuilder) { }

  ngOnInit() {
    this.countrylist = [{ Name: 'United States', Id: 'US' }];
    this.accountForm = this.fb.group({
      'firstname': ['', Validators.compose([Validators.required])],
      'lastname': ['', Validators.compose([Validators.required])],
      'name': ['', Validators.compose([Validators.required])],
      'country': ['', Validators.required],
      //'state': ['', Validators.required],
      'line1': ['', Validators.compose([Validators.required])],
      'line2': ['', Validators.compose([Validators.nullValidator])],
      'city': ['', Validators.compose([Validators.required])],
      'province': ['', Validators.compose([Validators.required])],
      'postalcode': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'phone': ['', Validators.compose([Validators.required])]
    });
    console.log(this.accountForm);

    this.imageUpload.onUploadCompleted.subscribe(event => {
      this.globalState.showLoader = false;
      const resp = JSON.parse(event.response);
      console.log(resp);
      localStorage.setItem("AccounteTag", resp.ETag);
    });
  }
  onUpload(resp){
    this.globalState.showLoader = false;
    console.log(resp);
  }
  // beforeUpload(uploadingFile: UploadedFile): void {
  //   if (uploadingFile.size > 1000000) {
  //     uploadingFile.setAbort();
  //     this.errorMessage = 'File is too large!';
  //   }
  // }

  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'Edit-My-Account';
    this.globalState.currentPageTitle = 'Edit My Account';
    let profile = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile')) : {};
    if (profile && profile.user_metadata) {
      this.globalState.currentPageSubTitle = profile.user_metadata.name;
    }
    const accountId = localStorage.getItem('accountId');
    this.zytoService.GetAccountDetailById(accountId)
      .subscribe(x => {
        this.account = x;
        console.dir(this.account);
        this.profile1 = (this.account.Image) ? this.account.Image.Html.Url : '';
        this.accountForm.patchValue({
          'name': this.account.Name
        });
        if (this.account.ContactInfo) {
          this.accountForm.patchValue({
            'firstname': (this.account.ContactInfo && this.account.ContactInfo.PersonName) ? this.account.ContactInfo.PersonName.FirstName : '',
            'lastname': (this.account.ContactInfo && this.account.ContactInfo.PersonName) ? this.account.ContactInfo.PersonName.LastName : '',
            'country':  (this.account.ContactInfo && this.account.ContactInfo.Address) ? this.account.ContactInfo.Address.Country : '',
            //'state': this.account.ContactInfo.Address.Province,
            'line1': (this.account.ContactInfo && this.account.ContactInfo.Address) ? this.account.ContactInfo.Address.Line1: '',
            'line2': (this.account.ContactInfo && this.account.ContactInfo.Address) ? this.account.ContactInfo.Address.Line2: '',
            'city':(this.account.ContactInfo && this.account.ContactInfo.Address) ?  this.account.ContactInfo.Address.City: '',
            'province': (this.account.ContactInfo && this.account.ContactInfo.Address) ? this.account.ContactInfo.Address.Province: '',
            'postalcode': (this.account.ContactInfo && this.account.ContactInfo.Address) ? this.account.ContactInfo.Address.PostalCode: '',
            'email': (this.account && this.account.ContactInfo) ? this.account.ContactInfo.Email: '',
            'phone': (this.account && this.account.ContactInfo) ? this.account.ContactInfo.Phone: '',
          });
        }
        if (
          this.account &&
          this.account.ContactInfo &&
          this.account.ContactInfo.Address &&
          this.account.ContactInfo.Address.Country
        ) {
          this.getStates(this.account.ContactInfo.Address.Country);
        }

        this.globalState.showLoader = false;

      });
  }

  pictureChangeEvent(file) {
    if (file.target.files) {
      let size = file.target.files["0"].size;
      size = size / 1024 / 1024;
      console.log(size);
      if (size > 6) {
        this.globalState.showMessage('error', 'Maximum picture size should be less then 6MB', 'Maximum size exceed');
        return false;
      } else {
        // this.getImageDimension(file.target.files["0"]).then((imgFile) => {
        //   if(imgFile.naturalWidth > 5000 || imgFile.naturalHeight > 5000){
        //     let errorMessage = `Dimension Exceeded - Allowed Image dimension are 5000px(w) x 5000px(h)`;
        //     this.globalState.showMessage('error',errorMessage,'');
        //     //$('#fileInput').val('');
        //   }
        // }).catch((error) => {
        //   //this.productImage = null;
        //   //$('#fileInput').val('');
        // })
      }
    }
  }

  // beforeUploadEvent(file){
  //   //return getImageDimension(file);
  // }

  // getImageDimension(imageFile): Promise<any> {
  //   return new Promise(function (resolve, reject) {
  //     const fr = new FileReader;
  //     fr.onload = function () {
  //       const image = new Image();
  //         image.onload = function () {
  //             resolve(image);
  //         };
  //         image.onerror = function (error) {
  //           reject(error);
  //         }
  //         image.src = fr.result;
  //     };
  //     fr.onerror = function (error) {
  //       reject(error);
  //     }
  //     fr.readAsDataURL(imageFile);
  //   });
  // }

  onSubmit(values: any): void {
    const self = this;
    for (const c in this.accountForm.controls) {
      console.log(typeof this.accountForm.controls[c]);
      this.accountForm.controls[c].markAsTouched();
    }
    console.dir(values);
    console.dir(this.account);
    if (this.accountForm.valid) {
      this.globalState.showLoader = true;
      this.zytoService.ChangeBulkAccount(values).subscribe(resp => {
        this.globalState.showMessage('success', 'Account Update successfully', 'Account Update');
        self.router.navigate(['/pages/account']);
        this.globalState.showLoader = false;
      }, error => {
        this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Message, 'Error');
        this.globalState.showLoader = false;
      });
    } else {
      let el = $('.ng-invalid:not(form):first').parent().parent().parent();
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
        this.globalState.showLoader = false;
      });
    }
  }

  onCountryChange($event) {
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

}
