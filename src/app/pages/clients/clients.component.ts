import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import { GlobalState } from '../../global.state';

import * as $ from 'jquery';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [ZytoService],
})
export class ClientsComponent implements OnInit, AfterViewInit {

  //alerts = [];
  loading: boolean = false;
  showOverlay: boolean = false;
  showInactive: boolean = false;
  resultClients: any;

  constructor(
    public router: Router,
    private zytoService: ZytoService,
    private route: ActivatedRoute,
    private globalState: GlobalState) {

  }
  ngAfterViewInit(): void {
    this.globalState.currentPage = 'clients';
    this.globalState.currentPageTitle = 'Clients';
  }
  ngOnInit() {
    this.loading = false;
    this.showInactive = false;
    console.log('GetAccountLicense................................................\\\\\\\\\\\\\\\\\\\\');
    this.zytoService.GetAccountLicense().subscribe(response => {
      if (response.License.Active && response.License.InGracePeriod && response.License.Expiration) {
        // const expire = (response.License.Expiration) ? moment(moment.utc(response.License.Expiration.Date).toDate()).format('YYYY-MM-DD HH:mm:ss') : '';
        const expireKill = (response.License.Expiration) ? moment(response.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
        this.globalState.gracePeriod = expireKill;
        this.globalState.expireLicense = true;
        this.globalState.licenseAlert = true;
        this.globalState.expireGraceLicense = false;
      }
      if (!response.License.Active && !response.License.InGracePeriod && response.License.Expiration) {

        this.globalState.expireLicense = true;
        this.globalState.licenseAlert = true;
        this.globalState.expireGraceLicense = true;
      }
    });
    this.refreshContent();
  }

  refreshContent() {
    console.log('in refreshContent');
    this.loading = true;
    this.globalState.showLoader = true;
    this.resultClients = null;
    this.zytoService.GetAllClientsWithSessionDetail('', (this.showInactive) ? null : 'false').subscribe(response => {
      response.forEach(element => {
        element.ProgramRuns = _.filter(element.ProgramRuns,function(elem:any){
            if(elem.Active){
              return elem;
            }
        });
      });
      this.resultClients = response;
      console.log(this.resultClients);
      this.loading = false;
      this.globalState.showLoader = false;
    });
  }

  startClientSession(client, flag = false, cont = false, fid = '') {
    // alert(flag);
    if (!flag) {
      client.continue = cont;
      client.programId = fid;
      this.globalState.startSessionEvent.emit(client);
    }
  }

}
