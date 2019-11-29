import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GlobalState } from '../../global.state';

import { ZytoService } from '../../services/zyto.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
})
export class ClientDetailComponent implements OnInit, AfterViewInit {

  client: any;
  programs: any;
  clientAssociation: any;
  alreadyHasSession: boolean;

  notes: any;
  notesAlreadyExists: boolean;
  notesEditMode: boolean;
  showNotes: boolean;

  constructor(private router: Router, private route: ActivatedRoute, public globalState: GlobalState, private zytoService: ZytoService) {

    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    this.removeAllSessionData();
    this.showNotes = false;
    this.notesAlreadyExists = false;
    this.notesEditMode = false;

    this.route.data.forEach((data: { client: any }) => {
      this.client = data.client.Client;
      this.programs = data.client.ProgramRuns;
      this.client.ContactInfo.Preference = _.pickBy(this.client.ContactInfo.Preference, function (value, key) {
        return value === true;
      });
      console.log(this.client);
      if (this.client && this.client.ContactInfo && this.client.ContactInfo.Preference) {
        this.client.ContactInfo.Preference = _.keys(this.client.ContactInfo.Preference).join(', ');
      }
    });
    
    this.zytoService.GetAccountLicense().subscribe(response => {
      if (response.License.Active && response.License.InGracePeriod) {
        const expire = (response.License.Expiration) ? moment(moment.utc(response.License.Expiration.Date).toDate()).format('YYYY-MM-DD HH:mm:ss') : '';
        const expireKill = (response.License.Expiration) ? moment(response.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
        this.globalState.gracePeriod = expireKill;
        this.globalState.expireLicense = true;
        this.globalState.licenseAlert = true;
        this.globalState.expireGraceLicense = false;
      }
      if (!response.License.Active && !response.License.InGracePeriod) {

        this.globalState.expireLicense = true;
        this.globalState.licenseAlert = true;
        this.globalState.expireGraceLicense = true;
      }
    });

    // this.zytoService.GetClientByIdTemp(this.client.Id).subscribe(response => {
    //   this.client = response;
    //   this.client.ContactInfo.Preference = _.pickBy(this.client.ContactInfo.Preference, function (value, key) {
    //     return value === true;
    //   });
    //   if (this.client && this.client.ContactInfo && this.client.ContactInfo.Preference) {
    //     this.client.ContactInfo.Preference = _.keys(this.client.ContactInfo.Preference).join(', ');
    //   }
    // })

    this.zytoService.GetClientAssociation(this.client.Id).subscribe(response => {
      this.clientAssociation = response;

      const year = new Date(this.client.AggregateInfo.CreatedDate).getFullYear();
      this.globalState.currentPageSubTitle = ((this.clientAssociation && this.clientAssociation.Archived) ? 'Inactive' : `Client Since ${year}`);
      this.globalState.currentPageSubTitleClasses = ((this.clientAssociation && this.clientAssociation.Archived) ? 'red-color' : '');
    });

    this.alreadyHasSession = false;

    // this.zytoService.GetAllSessionWithClientId(this.client.Id).subscribe(sessions => {
    //   const index = 0;
    //   if (sessions && sessions.length > 0 && sessions[index].Expired === false && sessions[index].State !== 'Completed') {
    //     this.alreadyHasSession = true;
    //   } else {
    //     this.alreadyHasSession = false;
    //   }
    //   this.globalState.showLoader = false;
    // });

    this.showNotesDetails();

  }

  ngAfterViewInit(): void {
    this.globalState.currentPage = 'Client Detail';
    this.globalState.currentPageTitle = 'Client Record';
    this.globalState.currentPageSubTitle = '';
  }

  startClientSession(client, flag = false, cont = false, fid = '') {
    // alert(flag);
    if (!flag) {
      client.continue = cont;
      client.programId = fid;
      this.globalState.startSessionEvent.emit(client);
    }
  }

  activateClient(clientId) {
    this.globalState.showLoader = true;
    this.zytoService.ArchiveClient(this.client.Id, true).subscribe(response => {
      this.globalState.showLoader = false;
      this.router.navigate(['/pages/client', this.client.Id, 'client-detail']).then(() => {
      });
      //location.reload();
      // this.router.navigate(['/']).then(() => {
      //   this.router.navigate(['/pages/client',this.client.Id,'client-detail']).then(() => {

      //   });
      // });
    });
  }

  deactivateClient(clientId) {
    this.globalState.showLoader = true;
    this.zytoService.ArchiveClient(this.client.Id, false).subscribe(response => {
      this.globalState.showLoader = false;
      //location.reload();
      this.router.navigate(['/pages/client', this.client.Id, 'client-detail']).then(() => {

      });
    });
  }

  showNotesDetails() {
    this.globalState.showLoader = true;
    this.notesEditMode = false;
    this.zytoService.GetClientNotes(this.client.Id).subscribe(
      response => {
        this.notesAlreadyExists = true;
        this.notes = response.Body;
      }, error => {
        this.notesAlreadyExists = false;
        this.notes = '';
        this.showNotes = true;
        this.globalState.showLoader = false;
      }, () => {
        this.showNotes = true;
        this.globalState.showLoader = false;
      });
  }

  saveNotes(clientId) {
    if (this.notes) {
      this.globalState.showLoader = true;
      const body = {
        'Body': this.notes,
      };
      this.zytoService.saveClientNotes(this.client.Id, body, (this.notesAlreadyExists) ? 'put' : 'post').subscribe(response => {
        this.globalState.showLoader = false;
        this.showNotesDetails();
      });
    } else {
      this.globalState.showMessage('error', 'Notes cannot be empty!', 'Validation Error');
    }
  }

  removeAllSessionData() {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentSessionClient');
    localStorage.removeItem('currentSessionClientId');
    localStorage.removeItem('currentSessionId');
    localStorage.removeItem('currentSessionInsight');
    localStorage.removeItem('currentSessionState');
  }
}
