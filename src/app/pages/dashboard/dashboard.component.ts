import { Component, OnInit, PipeTransform, Pipe, AfterViewInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import { ZytoScanService } from '../../services/zyto-scan.service';

//import { FlashMessagesService } from 'ngx-flash-messages';

import { NgbTabset, NgbTab } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as _ from 'lodash';
//import * as $ from 'jquery';
declare var Jcrop: any;
declare var $: any;

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, AfterViewInit {

  alerts = [];
  loading: boolean = false;
  showOverlay: boolean = false;
  showInactive: boolean = false;
  resultClients: any;
  searchString: any;

  constructor(
    private zytoService: ZytoService,
    private zytoScanService: ZytoScanService,
    public router: Router,
    private globalState: GlobalState,
    private route: ActivatedRoute,
  ) {
    this.globalState.showSidebar = true;
    this.globalState.showHeaderMenu = true;
    console.log('in here in dashboard alter message');
  }

  ngOnInit() {
    console.log('in ngOnInit');
    const self = this;
    this.loading = false;
    this.showInactive = false;
    this.searchString = '';
    // this.globalState.showSidebar = true;
    console.log('GetAccountLicense................................................\\\\\\\\\\\\\\\\\\\\');
    this.zytoService.GetAccountLicense().subscribe(resp => {
      localStorage.setItem("eTag", resp.ETag);
      localStorage.setItem("accountDetail", JSON.stringify(resp));
      const expire = (resp.License.Expiration) ? moment(moment.utc(resp.License.Expiration.Date).toDate()).format('YYYY-MM-DD HH:mm:ss') : '';
      const expireKill = (resp.License.Expiration) ? moment(resp.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
      var now = moment.utc(); //todays date
      var end = (resp.License.Expiration) ? moment(resp.License.Expiration.Date) : moment(); // another date
      var endKill = (resp.License.Expiration) ? moment(resp.License.Expiration.KillDate) : moment(); // another date
      var duration = moment.duration(end.diff(now));
      var durationkill = moment.duration(endKill.diff(now));
      var hourse = duration.asHours();
      var hourseKill = durationkill.asHours();
      console.log(hourse)
      if (hourse < 0 && resp.License.Expiration) {
        this.globalState.gracePeriod = expireKill;
        this.globalState.expirePeriod = expire;
        this.globalState.expireLicense = true;
        this.globalState.licenseAlert = true;
        this.globalState.expireGraceLicense = false;
      }
      if (hourseKill < 12 && resp.License.Expiration) {
        this.globalState.gracePeriod = expireKill;
        this.globalState.expirePeriod = expire;
        this.globalState.expireLicense = true;
        this.globalState.licenseAlert = true;
        this.globalState.expireGraceLicense = true;
      }
      // const expireKill = (response.License.Expiration) ?  moment(response.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
      // this.globalState.expireLicense = true;
      // this.globalState.licenseAlert = true;
      // this.globalState.gracePeriod = expireKill;
      // this.globalState.expireGraceLicense = true;

    });

    //this.globalState.notifyDataChanged('menu.activeLink', {title:'Dashboard'});

    this.globalState.dashboardSearchQueryChangeEvent.subscribe(queryString => {
      console.log('in subscribed');
      console.log(queryString);
      this.searchString = queryString;

      self.serachClient(queryString);

    });

    this.globalState.showLoader = false;
  }
  ngAfterViewInit(): void {
    const self = this;
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'dashboard1';
    this.globalState.currentPageTitle = '';

    this.route
      .queryParams
      .subscribe(params => {
        console.log('in params');
        console.log(params);
        const search = params['search'] || '';
        console.log(`search = ${search}`);
        if (search) {
          self.globalState.dashboardSearchQueryChangeEvent.emit(search);
        }
      });
    this.globalState.showLoader = false;
  }

  serachClient(value) {
    this.globalState.currentPage = 'dashboard';
    console.log('in serachClient');
    console.log(value);
    this.loading = true;
    this.globalState.showLoader = true;
    this.resultClients = null;
    this.zytoService.GetAllClientsWithSessionDetail(value, (this.showInactive) ? null : 'false').subscribe(response => {
      console.log(response);
      this.resultClients = response;
      this.loading = false;
      this.globalState.showLoader = false;
      this.globalState.currentPageTitle = 'Search Results';
    });
  }

  startClientSession(client) {
    this.globalState.startSessionEvent.emit(client);
  }

  refreshContent() {
    this.serachClient(this.searchString);
  }

}
