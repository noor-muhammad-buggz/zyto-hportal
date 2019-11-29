import { Injectable, EventEmitter, ReflectiveInjector } from "@angular/core";
import { Subject } from "rxjs/Subject";
import {
  Router,
  NavigationEnd,
  NavigationStart,
  Event,
  NavigationError,
  NavigationCancel,
  RoutesRecognized
} from "@angular/router";

import { environment } from "../environments/environment";
import { ZytoService } from "./services/zyto.service"
import { BaThemeSpinner } from "./theme/services/baThemeSpinner/baThemeSpinner.service";
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from './services/analytics.service';
import * as moment from 'moment';
@Injectable()
export class GlobalState {
  enabledDebug: boolean = !environment.production;

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Function[]> = new Map<
    string,
    Function[]
    >();

  showLoader: boolean = false;
  showInsightsLoader: boolean = false;
  licenseAlert: boolean = false;
  expireLicense: boolean = false;
  expireGraceLicense: boolean = false;
  gracePeriod: any;
  expirePeriod: any;
  showFullLoader: boolean = false;
  showSidebar: boolean = true;
  showHeaderMenu: boolean = true;
  currentPage: string;
  currentPageTitle: string;
  currentPageSubTitle: string;
  currentPageSubTitleClasses: string;
  dashboardSearchQueryChangeEvent: EventEmitter<any> = new EventEmitter();
  startSessionEvent: EventEmitter<any> = new EventEmitter();
  foundationStatus: EventEmitter<any> = new EventEmitter();
  trainingAlreadyCompleted: EventEmitter<any> = new EventEmitter();
  contraindictionPopupEvent: EventEmitter<any> = new EventEmitter();
  clearSessionLocalStorageEvent: EventEmitter<any> = new EventEmitter();
  dataProcessEvent: EventEmitter<any> = new EventEmitter();

  state: any;

  constructor(private router: Router, private baThemeSpinner: BaThemeSpinner, public toastrService: ToastrService, private analyticsService: AnalyticsService, private zytoService: ZytoService) {
    const self = this;
    this._dataStream$.subscribe(data => this._onEvent(data));

    this.currentPage = "";



    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: any) => {
        console.log("in global route change subscribe:");
        this.expireLicense = false;
        this.expireGraceLicense = false;
        this.licenseAlert = false;
        this.state = {
          currentPage: this.currentPage,
          currentPageTitle: this.currentPageTitle,
          currentPageSubTitle: this.currentPageSubTitle,
          currentPageSubTitleClasses: this.currentPageSubTitleClasses
        };

        this.currentPage = '';
        this.currentPageTitle = '';
        this.currentPageSubTitle = '';
        this.currentPageSubTitleClasses = '';

        //this.showLoader = false;
      });

    console.log("in global route change subscribe 2:");
    this.router.events.subscribe(event => {
      console.log("in global route change subscribe 2:");
      console.log(event);
      Webcam.reset();
      // Webcam.off();
      //console.log(typeof event);
      //console.log(instanceof event);
      if (event instanceof NavigationStart) {
        
        const injector = ReflectiveInjector.resolveAndCreate([AnalyticsService]);
        this.analyticsService = injector.get(AnalyticsService);
        console.log(event);
        this.analyticsService.logPageView(event.url, event.url);
        const dashboard_page_regex = /dashboard/i;
        if (!dashboard_page_regex.test(event.url)) {
          const printscreen = /print-screen$/i;
          const checkout = /checkout-$/i;
          if (printscreen.test(event.url) || checkout.test(event.url)) {
            self.showFullLoader = true;
          } else {
            self.showLoader = true;
          }
          // console.log('asd');
          //self.baThemeSpinner.show();
        }
      } else if (
        event instanceof NavigationEnd
      ) {
        //self.showLoader = false;
        //self.showFullLoader = false;
        //self.baThemeSpinner.hide();
        let response = JSON.parse(localStorage.getItem('accountDetail'));
        console.log(response);
        if (response) {
          const expire = (response.License.Expiration) ? moment(moment.utc(response.License.Expiration.Date).toDate()).format('YYYY-MM-DD HH:mm:ss') : '';
          const expireKill = (response.License.Expiration) ? moment(response.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
          var now = moment.utc(); //todays date
          var end = moment((response.License.Expiration) ? response.License.Expiration.Date : ''); // another date
          var duration = moment.duration(end.diff(now));
          var hourse = duration.asHours();
          console.log(hourse)
          if (hourse < 12 && response.License.Expiration) {
            const accountId = localStorage.getItem('accountId');
            if (accountId) {
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
                if (hourse < 12 && resp.License.Expiration) {
                  this.gracePeriod = expireKill;
                  this.expirePeriod = expire;
                  this.expireLicense = true;
                  this.licenseAlert = true;
                  this.expireGraceLicense = false;
                }
                if (hourseKill < 12 && resp.License.Expiration) {
                  this.gracePeriod = expireKill;
                  this.expirePeriod = expire;
                  this.expireLicense = true;
                  this.licenseAlert = true;
                  this.expireGraceLicense = true;
                }


              });
            }
          }


          // const expireKill = (response.License.Expiration) ?  moment(response.License.Expiration.KillDate).format('YYYY-MM-DD HH:mm:ss') : '';
          // this.expireLicense = true;
          // this.licenseAlert = true;
          // this.gracePeriod = expireKill;
          // this.expireGraceLicense = true;
        } else {
          const accountId = localStorage.getItem('accountId');
          if (accountId) {
            this.zytoService.GetAccountLicense().subscribe(resp => {
              localStorage.setItem("eTag", resp.ETag);
              localStorage.setItem("accountDetail", JSON.stringify(resp));
            });
          }
        }
      } else if (
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        self.showLoader = false;
        self.showFullLoader = false;
        console.log(event);
        this.analyticsService.logException(JSON.stringify(event), event.url, '', '', 'Navigation');
        //self.showSidebar = true;
        //self.showHeaderMenu = true;

        //self.baThemeSpinner.hide();

        console.log('in NavigationCancel');
        console.log(this.state);

        this.currentPage = this.state.currentPage;
        this.currentPageTitle = this.state.currentPageTitle;
        this.currentPageSubTitle = this.state.currentPageSubTitle;
        this.currentPageSubTitleClasses = this.state.currentPageSubTitleClasses;
      }


      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });

  }

  private logNavigation() {
    console.log(this.currentPage);

  }

  notifyDataChanged(event, value) {
    const current = this._data[event];
    if (current !== value) {
      this._data[event] = value;

      this._data.next({
        event,
        data: this._data[event]
      });
    }
  }

  subscribe(event: string, callback: Function) {
    const subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
  }

  _onEvent(data: any) {
    const subscribers = this._subscriptions.get(data["event"]) || [];

    subscribers.forEach(callback => {
      callback.call(null, data["data"]);
    });
  }

  setFlashMessage(key, alert) {
    let flash: any;
    if (localStorage.getItem('flash') !== null) {
      flash = JSON.parse(localStorage.getItem('flash'));
      flash[key] = flash[key] || [];
      flash[key].push(alert);
      localStorage.setItem('flash', JSON.stringify(flash));
    } else {
      flash = {
        dashboard: [alert],
      };
      localStorage.setItem('flash', JSON.stringify(flash));
    }
  }

  showMessage(type, message, title) {
    if (type == 'remove') {
      this.toastrService.remove(title);
    } else if (type == 'warning') {
      this.toastrService.warning(message, title, {
        closeButton: true,
      });
    } else if (type == 'error') {
      this.toastrService.error(message, title, {
        closeButton: true,
      });
    } else if (type == 'success') {
      this.toastrService.success(message, title, {
        closeButton: true,
      });
    } else {
      this.toastrService.info(message, title, {
        closeButton: true,
      });
    }
  }
}
