import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
@Component({
  selector: "app-account-selection",
  templateUrl: "./account-selection.component.html",
  styleUrls: ["./account-selection.component.scss"]
})
export class AccountSelectionComponent implements OnInit {
  reason:any;
  accountsDetails: any;
  subscribed: any[];

  constructor(private route:ActivatedRoute,public router: Router,public globalState: GlobalState,private zytoService: ZytoService) {}

  ngOnInit() {
    console.log('in distributor selection ngOnInit');
    console.log('this.globalState.showSidebar:',this.globalState.showSidebar);

    this.route.params.subscribe(params => {
      this.reason = params['reason']; // (+) converts string 'id' to a number
      // console.log('id:' + this.id);
      });

    this.accountsDetails = JSON.parse(
      localStorage.getItem("healthProfessionalAccounts")
    );
    console.log('this.accountsDetails:',this.accountsDetails);

    this.subscribed = [];
    this.subscribed[0] = this.router.events.subscribe(event => {
      console.log("in global route change subscribe 2:");
      console.log(event);
      if (
        event instanceof NavigationEnd
      ) {
        this.globalState.showLoader = false;
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.globalState.showSidebar = false;
    this.globalState.showHeaderMenu = false;
  }

  selectAccount(account) {
    console.log(account);
    localStorage.setItem("accountId", account.Id);
    localStorage.setItem("eTag", account.ETag);
    localStorage.setItem(
      "accountDetail",
      JSON.stringify(account)
    );
    this.globalState.showLoader = true;
    console.log('GetAccountLicense................................................\\\\\\\\\\\\\\\\\\\\');
    this.zytoService.GetAccountLicense().subscribe(response => {
      if(response.AccountLicense){
        localStorage.setItem('accountLicense',JSON.stringify(response.License));
      }
      // if(response.AccountLicense && false){
      //   const expireKill = moment(response.AccountLicense.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss');

      //   if (moment(expireKill).diff(moment(), 'minutes') <= 0) {
      //     localStorage.setItem('accountLicense','true');
      //   }else{
      //     localStorage.removeItem('accountLicenseExpired');
      //   }
      // }else{
      //   localStorage.setItem('noAccountLicenseExpired','true');
      // }
      this.globalState.showLoader = false;
      this.router.navigate(["/pages/dashboard"]);
    },error => {
      this.router.navigate(["/pages/dashboard"]);
    });

    //this.router.navigate(["/pages/dashboard"]);
  }

  ngOnDestroy(): void {
    console.log('in ng on destory for account selection');
    this.subscribed.forEach(event => event.unsubscribe());
  }
}
