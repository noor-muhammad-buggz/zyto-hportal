import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../global.state';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { ZytoScanService } from '../../services/zyto-scan.service';
import * as moment from 'moment';

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.scss']
})
export class CheckoutCompleteComponent implements OnInit {
  orderId: any;
  clientId: any;
  sessionId: any;
  url: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _zytoService: ZytoService,
    private _zytoClientService: ZytoClientWellnessService,
    private ZytoScanService: ZytoScanService,
    private globalState: GlobalState, 
    public router: Router,
  ) { 
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
          console.log('prev:', e);
          this.url = e;
      });
    this.globalState.showFullLoader = true;
    this.globalState.showLoader = true;
  }

  ngOnInit() {
    this.globalState.showSidebar = false;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params['sale-order-id'];
      this.clientId = params['id'];
      this.sessionId = params['sid'];
      console.log('URL parameter');
    });

    this._zytoService.GetSalesrdersById(this.orderId).subscribe(response => {
      console.log(response);
      let date = moment.utc(response.AggregateInfo.CreatedDate).local(); 
      this.globalState.currentPageSubTitle =  `${date.format('MM/DD/YYYY')}`;
      this.globalState.showFullLoader = false;
      this.globalState.showLoader = false;
      console.log(response);
      if(response.Status == 'Created'){
        let self = this;
        setTimeout(() => {
          this.router.navigate(['/pages/client/', this.clientId, 'sessions', this.sessionId, 'checkout-cart', this.orderId]);
        }, 1000);
        this.globalState.showMessage('error','Order is not paid yet. Redirecting too checkout screen','Order not paid');
      }
    });
  }

  ngAfterViewInit() {
    console.log('in ngAfterViewInit');
    this.globalState.currentPage = 'checkout-complete';
    this.globalState.currentPageTitle = 'Order Complete';
  }
  print(){
    this.globalState.showLoader = true;
    this._zytoClientService.GetActionPlanDetail(this.sessionId).subscribe(response => {
      localStorage.setItem('prevPrintUrl',this.url.url);
      localStorage.setItem('ActionPlan', JSON.stringify(response));
      // localStorage.setItem('BiosurveyActionPlan', JSON.stringify(response));
      this.router.navigate(['/pages/sessions' , this.sessionId, 'action-plan-print']);
    });
  }
  
}
