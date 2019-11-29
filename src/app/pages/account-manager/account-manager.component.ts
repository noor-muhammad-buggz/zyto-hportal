import { Component, OnInit, AfterViewInit } from '@angular/core';
import {GlobalState} from '../../global.state';
import { ZytoService } from '../../services/zyto.service';

@Component({
  selector: 'app-plan',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit, AfterViewInit {
  manager:any;

  constructor(public globalState: GlobalState,public zytoService: ZytoService) { }

  ngOnInit() {
    this.globalState.showLoader = true;
    const account = JSON.parse(localStorage.getItem('accountDetail'));
    if(account && account.Manager.AdministratorId){
      return this.zytoService.GetAccountRep(account.Manager.AdministratorId).subscribe(libraryManager => {
        this.manager = libraryManager;
        this.globalState.showLoader = false;
      },error => {
        this.globalState.showLoader = false;
      });
    }

  }

  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'Account-Rep';
    this.globalState.currentPageTitle = 'Account Rep';
    let profile = (localStorage.getItem('userProfile')) ? JSON.parse(localStorage.getItem('userProfile')) : {};
    if(profile && profile.user_metadata){
      this.globalState.currentPageSubTitle = profile.user_metadata.name;
    }
  }

}
