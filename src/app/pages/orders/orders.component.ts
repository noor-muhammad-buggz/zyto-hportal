import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GlobalState } from "../../global.state";
import { ZytoService } from '../../services/zyto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  clientId:any;
  orders: any = [];
  profile: any;
  continuationToken: any;
  TotalRecord: any;
  throttle = 50;
  scrollDistance = 0;
  scrollUpDistance = 2;
  direction = '';

  constructor(private route:ActivatedRoute,
              private zytoService: ZytoService,
              public globalState: GlobalState,) { }

  ngOnInit() {
    this.globalState.showLoader = true;
    this.route.params.subscribe(params => {
      this.clientId = params['id']; // (+) converts string 'id' to a number
      // console.log('id:' + this.id);
    });
    this.profile = JSON.parse(localStorage.getItem('userProfile'));
    console.log(this.profile);
    this.zytoService.GetAllsalesorders(this.clientId,10,'').subscribe(response => {
      let headers = response.headers;
      this.continuationToken = headers.get('continuation-token');
      console.log(headers);
      this.orders = response.json();
      this.globalState.showLoader = false;
    });
  }

  ngAfterViewInit() {
    console.log("in ngAfterViewInit");
    this.globalState.currentPage = "orders";
    this.globalState.currentPageTitle = "Orders";
    let profile = localStorage.getItem("userProfile")
        ? JSON.parse(localStorage.getItem("userProfile"))
        : {};
    if (profile && profile.user_metadata) {
        this.globalState.currentPageSubTitle = profile.user_metadata.name;
    }
  }

  onScrollDown() {
    if(this.continuationToken != null){
      this.zytoService.GetAllsalesorders(this.clientId,10,this.continuationToken).subscribe(response => {
        let headers = response.headers;
        this.continuationToken = headers.get('continuation-token');
        console.log(headers);
        const orders = response.json();
        orders.forEach(element => {
          this.orders.push(element);
        });
        // this.globalState.showLoader = false;
      });
    }
  }

}
