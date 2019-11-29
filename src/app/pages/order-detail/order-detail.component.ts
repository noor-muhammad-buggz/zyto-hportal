import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoService } from '../../services/zyto.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  salesOrderId: any;
  order: any = '';
  pendingSaleOrderData: any;
  constructor(private route:ActivatedRoute,
              private zytoService: ZytoService,
              public globalState: GlobalState,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.salesOrderId = params['oid']; // (+) converts string 'id' to a number
      // console.log('id:' + this.id);
    });
    this.zytoService.GetSalesrdersByIdWithDetail(this.salesOrderId).subscribe(response => {
      this.pendingSaleOrderData = response.SalesOrder;
        this.pendingSaleOrderData.LineItems.forEach(item => {
          const selectedItem = _.find(response.DistributorProducts, function(o: any) {
            return o.Id == item.DistributorProduct.Id;
          });
          item.Name = (selectedItem)? selectedItem.Name : item.DistributorProduct.Id;
        });

      this.order = response;
      console.log(this.pendingSaleOrderData);
      this.globalState.showLoader = false;
    });
  }

  ngAfterViewInit() {
    console.log("in ngAfterViewInit");
    this.globalState.currentPage = "Order-Detail";
    this.globalState.currentPageTitle = "Order Detail";
  }

}
