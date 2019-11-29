import { Component, OnInit, AfterViewInit } from '@angular/core';
import {GlobalState} from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import * as moment from 'moment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {
  account: any;
  profile: any;

  constructor(public globalState: GlobalState,private zytoService: ZytoService) { 
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    this.account = (localStorage.getItem('accountDetail')) ? JSON.parse(localStorage.getItem('accountDetail')) : {};
    console.log(this.account);
    this.profile = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile')) : {};
    const accountId = localStorage.getItem('accountId');
    this.zytoService.GetAccountDetailById(accountId)
          .subscribe(x => {
            this.account = x;
            console.log(this.account);
            localStorage.setItem("eTag", x.ETag);
            localStorage.setItem("accountDetail", JSON.stringify(x));
            this.globalState.showLoader = false;
          });
    // this.zytoService.GetClientWellnesssResults(this.clientId)
    // .subscribe(savedResponse => {
    //   this.savedResponse = savedResponse;
    //   this.existing = true;
    // });
  }

  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'My-Account';
    this.globalState.currentPageTitle = 'My Account';
    const year = moment.utc(this.account.AggregateInfo.CreatedDate).local();
    this.globalState.currentPageSubTitle = `Member Since ${year.format('YYYY')}`;
  }

}
