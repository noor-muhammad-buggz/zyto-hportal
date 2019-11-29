import { Component, OnInit, AfterViewInit } from '@angular/core';
import {GlobalState} from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss','../../theme/sass/as_custom.css']
})
export class PlanComponent implements OnInit, AfterViewInit {
  accountID: any;
    accountDetail: any;
    invoices: any;
    billingInfo: any;
    continueToken: any;
    page: any = 1;
  constructor(public globalState: GlobalState,
              public _zytoService: ZytoService) { 
                this.globalState.showLoader = true;
              }

  ngOnInit() {
    const account = JSON.parse(localStorage.getItem('accountDetail'));
    console.log('GetAccountLicense................................................\\\\\\\\\\\\\\\\\\\\');
    this.getAccountDetail();
  }
  getAccountDetail(){
    this._zytoService.GetAccountDetail().subscribe(resp => {
      // if(resp.License.InGracePeriod){
      //   const date1 = moment.utc(resp.License.AggregateInfo.CreatedDate).toDate();
      //   this.activeDate = moment(date1).format('YYYY-MM-DD HH:mm:ss');
      //   const date2 = moment.utc(resp.License.Expiration.Date).toDate();
      //   this.renewDate = moment(date2).format('YYYY-MM-DD HH:mm:ss');
      // }
      this.accountDetail = resp;
      if(this.accountDetail.Subscription && this.accountDetail.Subscription.CreditCards && this.accountDetail.Subscription.CreditCards.length > 0) {
        this.billingInfo = _.find(this.accountDetail.Subscription.CreditCards, function(item:any){ return (item.Default) });
      }
      console.log('ACCOUNT DETAILS ARE :', this.accountDetail);
      this.globalState.currentPage = 'account-plan';
      this.globalState.currentPageTitle = `${this.accountDetail.Account.Name}`;
      this.globalState.currentPageSubTitle = `ACCOUNT PLAN`;
      // this.loadInvoices();
      this.globalState.showLoader = false;
    }, error => {
      this.globalState.showMessage('error',error.Message,'Error');
      this.globalState.showLoader = false;
    });
  }

  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'My-Plan';
    this.globalState.currentPageTitle = 'My Plan';
    let profile = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile')) : {};
    if(profile && profile.user_metadata){
      this.globalState.currentPageSubTitle = profile.user_metadata.name;
    }
    // this.globalState.showLoader = false;
  }

  reActivate() {
    this.globalState.showLoader = true;
    this._zytoService.reactivateSubscription().subscribe(response => {
      localStorage.setItem("AccounteTag", response.ETag);
      localStorage.setItem("accountDetail", JSON.stringify(response));
      this.getAccountDetail();
      this.globalState.showLoader = false;
    });
  }

}
