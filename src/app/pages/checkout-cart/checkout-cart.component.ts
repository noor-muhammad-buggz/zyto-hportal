import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { GlobalState } from '../../global.state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ZytoService } from '../../services/zyto.service';
import { ZytoScanService } from '../../services/zyto-scan.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-checkout-cart',
    templateUrl: './checkout-cart.component.html',
    styleUrls: ['./checkout-cart.component.scss']
})
export class CheckoutCartComponent implements OnInit {
    clientId: any;
    sessionId: any;
    checkoutCart: any;
    orderId: any;
    cartForm: FormGroup;
    salesOrder: any;
    pendingSaleOrderData: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private zytoService: ZytoService,
        private ZytoScanService: ZytoScanService,
        private globalState: GlobalState,
        public router: Router,
        private fb: FormBuilder) {
        this.globalState.showFullLoader = true;

        this.globalState.showSidebar = false;
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.clientId = params['id'];
            this.sessionId = params['sid'];
            this.orderId = params['sale-order-id'];
            console.log('URL parameter');
            console.log(this.clientId);

            this.cartForm = this.fb.group({
                LineItems: this.fb.array([]),
            });
        });
        // this.zytoService.PrepareSalesOrder(1, this.sessionId).subscribe(response => {
        // this.ZytoScanService.GetBiosurveyActionPlan(1, this.sessionId).subscribe(response => {
        //     console.log(response);
        //     this.orderId = response.PendingSalesOrder.Id;
        this.zytoService.GetSalesrdersByIdWithDetail(this.orderId).subscribe(response => {
            console.log(response);
            this.salesOrder = response;
            let date = moment.utc(this.salesOrder.Client.AggregateInfo.CreatedDate).local();
            this.globalState.currentPageSubTitle = `${this.salesOrder.Client.PersonInfo.Name.FirstName} ${this.salesOrder.Client.PersonInfo.Name.LastName} | ${date.format('MM/DD/YYYY')}`;

            this.pendingSaleOrderData = response.SalesOrder;
            if (this.pendingSaleOrderData.LineItems) {
                this.pendingSaleOrderData.LineItems.forEach(item => {
                    const selectedItem = _.find(response.DistributorProducts, function (o: any) {
                        return o.Id == item.DistributorProduct.Id;
                    });
                    item.Detail = selectedItem;
                    //this.globalState.showSidebar = false;
                });
            } else {
                const self = this;
                this.globalState.showMessage('warning', 'Cart is empty.', 'No Supplements');
                self.router.navigate(['/pages/client/', this.clientId, 'sessions', this.sessionId, 'action-plan']);
            }
            console.log('this.pendingSaleOrderData:', this.pendingSaleOrderData);
            this.checkoutCart = response;
            this.initLineItemForm();
            this.globalState.showFullLoader = false;
            this.globalState.showLoader = false;
        });
        // });
        // });

    }
    ngAfterViewInit() {
        console.log('in ngAfterViewInit');
        this.globalState.currentPage = 'checkout-cart';
        this.globalState.currentPageTitle = 'Your Cart';
    }
    initLineItemForm() {
        const control = <FormArray>this.cartForm.controls['LineItems'];
        console.log(control);
        this.checkoutCart.SalesOrder.LineItems.forEach(x => {
            control.push(this.prePopulateForm(x));
        })
        //this.globalState.showSidebar = false;
    }

    prePopulateForm(product) {
        return this.fb.group({
            DistributorProduct: this.fb.group({
                DistributorId: [product.DistributorProduct.DistributorId, Validators.required],
                Id: [product.DistributorProduct.Id, Validators.required],
            }),
            Quantity: [product.Quantity, Validators.compose([Validators.required,this.validateMin, Validators.pattern('^[0-9]*$')])],
        });
    }
    validateMin(c: FormControl) {
        let EMAIL_REGEXP: any = "..."

        return (!c.value || isNaN(c.value)) ? null : (c.value > 0) ? null : {
            validateMin: {
                valid: false
            }
        };
    }
    remove(id) {
        if (confirm('Do you want to remove this')) {
            this.globalState.showFullLoader = true;
            this.globalState.showLoader = true;
            const formArray = <FormArray>this.cartForm.controls['LineItems'];
            formArray.removeAt(id);
            this.onsubmit(this.cartForm.value, 'removed');
        }
    }

    onsubmit(value, type = '') {
        console.log(this.cartForm);
        if (this.cartForm.valid) {
            this.globalState.showFullLoader = true;
            this.globalState.showLoader = true;
            console.log(value);
            this.zytoService.changeLineItems(this.orderId, value).subscribe(x => {
                // this.ZytoScanService.GetBiosurveyActionPlan(1, this.sessionId).subscribe(response => {
                //   console.log(response);
                //   this.orderId = response.PendingSalesOrder.Id;
                this.zytoService.GetSalesrdersByIdWithDetail(this.orderId).subscribe(response => {
                    this.pendingSaleOrderData = response.SalesOrder;
                    if (this.pendingSaleOrderData.LineItems) {
                        this.pendingSaleOrderData.LineItems.forEach(item => {
                            const selectedItem = _.find(response.DistributorProducts, function (o: any) {
                                return o.Id == item.DistributorProduct.Id;
                            });
                            item.Detail = selectedItem;
                            // this.globalState.showSidebar = false;
                        });
                    } else {
                        const self = this;
                        this.globalState.showMessage('warning', 'Cart is empty.', 'No Supplements');
                        self.router.navigate(['/pages/client/', this.clientId, 'sessions', this.sessionId, 'action-plan']);
                    }

                    this.checkoutCart = response;
                    if (type == 'removed') {
                        this.globalState.showMessage('info', 'Item Removed successfully', 'Removed');
                    } else {
                        this.globalState.showMessage('success', 'Item Updated successfully', 'Updated');
                    }
                    // this.initLineItemForm();
                    this.globalState.showFullLoader = false;
                    this.globalState.showLoader = false;
                }, error => {
                    this.globalState.showMessage('error', error.Message, 'Error');
                    this.globalState.showFullLoader = false;
                    this.globalState.showLoader = false;
                });
                // });
            }, error => {
                this.globalState.showMessage('error', error.Message, 'Error');
                this.globalState.showFullLoader = false;
                this.globalState.showLoader = false;
            });
        } else {
            let el = $('.ng-invalid:not(form):first').parent().parent().parent();
            $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
                el.focus();
            });
        }

    }
    RedirectToCheckoutSummary() {
        this.globalState.showFullLoader = true;
        this.globalState.showLoader = true;
        let self = this;
        self.router.navigate(['/pages/client/', this.clientId, 'sessions', this.sessionId, 'checkout-summary', this.orderId]);
    }
    
}
