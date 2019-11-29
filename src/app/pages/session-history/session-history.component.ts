import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../global.state';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import { ZytoScanService } from '../../services/zyto-scan.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-session-history',
  templateUrl: './session-history.component.html',
  styleUrls: ['./session-history.component.scss']
})
export class SessionHistoryComponent implements OnInit {
  clientId: any;
  history: any;
  profile: any;
  emptyMsg: any;
  throttle = 150;
  scrollDistance = 0;
  scrollUpDistance = 2;
  direction = '';
  regenrateInsights: any;
  continuationToken: any;

  constructor(
    private route: ActivatedRoute,
    private ZytoService: ZytoService,
    private zytoScanService: ZytoScanService,
    private globalState: GlobalState,
    public router: Router, ) {
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    // this.globalState.showLoader = true;
    this.route.params.subscribe(params => {
      this.clientId = params['id']; // (+) converts string 'id' to a number
      // console.log('id:' + this.id);
    });
    this.profile = JSON.parse(localStorage.getItem('userProfile'));
    this.ZytoService.GetAllCompletedSessionWithClientId(this.clientId, '10').subscribe(response => {
      let headers = response.headers;
      this.continuationToken = headers.get('continuation-token');
      // console.log(setCookieHeader);
      response = response.json();
      if (response != '') {
        this.history = response;
      } else {
        this.history = null;
        this.emptyMsg = 'No session has been completed so far.';
      }
      setTimeout(() => {
        this.globalState.showLoader = false;
      }, 250);
    });
  }

  onScrollDown(ev) {
    let history = this.history;
    console.log('scrolled down!!', this.continuationToken);
    // this.endPage = this.endPage + this.pageSize
    if (this.continuationToken && this.continuationToken != null) {
      this.ZytoService.GetAllCompletedSessionWithClientId(this.clientId, '10', this.continuationToken).subscribe(response => {
        let headers = response.headers;
        this.continuationToken = headers.get('continuation-token');
        // console.log(setCookieHeader);
        response = response.json();
        response.forEach(element => {
          this.history.push(element);
        });
      });
    }
    console.log(this.history);
  }

  checkStatus(pid){
    this.globalState.showLoader = true;
    this.zytoScanService.GetSessionWithId(pid).subscribe(response =>{
      this.globalState.foundationStatus.emit(response);
      this.globalState.showLoader = false;
    });
    // this.globalState.foundationStatus();
  }
}
