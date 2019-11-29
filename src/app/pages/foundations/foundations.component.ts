import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-foundations',
    templateUrl: './foundations.component.html',
    styleUrls: ['./foundations.component.scss', '../../theme/sass/as_custom.css'],
    providers: [ZytoService],
})
export class FoundationsComponent implements OnInit, AfterViewInit {


    existing: any;
    response: any;
    programId: any;
    loading: boolean = false;
    submitted = false;
    wellnessForm: FormGroup;
    savedResponse: any;
    formSubmited: boolean;
    isSuccessful: boolean;
    isFailed: boolean;
    errors: string[] = [];
    show: any;

    foundationDetail: any;
    start: any = 0;
    end: any = 5;
    serviceStart: any = 0;
    serviceEnd: any = 5;
    closeResult: string;
    distOptions: any;
    selectedOption: any = "";
    selectedDistId: any = "";
    
    // @HostListener('window:beforeunload', [ '$event' ])
    // beforeUnloadHander(event) {
    //   console.log('in onbeforeunload');
    //   //let result = confirm("Are you sure you want to leave current Session?");
    //   //return (result)? 'ok' : 'cancel';
    //   return "Are you sure you want to leave current Session?";
    // }

    constructor(
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private _ZytoService: ZytoService,
        private zytoClientWellnessService: ZytoClientWellnessService,
        public globalState: GlobalState,
        private fb: FormBuilder,
        private modalService: NgbModal,
        
        ) {
            this.globalState.showSidebar = true;
            this.globalState.showLoader = true;
        }
        private modalRef: NgbModalRef;
    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.programId = params['pid'];
        });
        this.loadFoundation();
    }
    ngAfterViewInit(): void {
        $('[data-toggle="tooltip"]').tooltip();
        // throw new Error("Method not implemented.");
        this.globalState.currentPage = 'FOUNDATIONS-FOR-WELLNESS';
        this.globalState.currentPageTitle = 'FOUNDATIONS FOR WELLNESS';
        this.globalState.currentPageSubTitle = 'Insights';

    }
    loadFoundation() {
        this.zytoClientWellnessService.GetFoundationOverview(this.programId).subscribe(response => {
        
            this.foundationDetail = response;

            if (this.foundationDetail.DistributorProducts) {
                this.foundationDetail.DistributorProducts.forEach(element => {
                    if (element.FoundationIds) {
                        element.FoundationDetail = [];
                        element.FoundationIds.forEach(foundation => {
                            let filterResult = _.filter(this.foundationDetail.Foundations, function (elem: any) {
                                if (elem.Id == foundation) {
                                    return elem;
                                }
                            });
                            element.FoundationDetail.push(filterResult[0]);
                        });
                    }
                });
            }
            if (this.foundationDetail.Services) {
                this.foundationDetail.Services.forEach(element => {
                    if (element.FoundationIds) {
                        element.FoundationDetail = [];
                        element.FoundationIds.forEach(foundation => {
                            let filterResult = _.filter(this.foundationDetail.Foundations, function (elem: any) {
                                if (elem.Id == foundation) {
                                    return elem;
                                }
                            });
                            element.FoundationDetail.push(filterResult[0]);
                        });
                    }
                });
            }

            console.log('Foundation Summary is : ', this.foundationDetail);
            this.globalState.showLoader = false;
        },
            error => {
                this.globalState.showLoader = false;
            });
    }

    loadMore() {
        this.end = this.end + 5;
    }
    loadLess() {
        this.start = 0;
        this.end = 5;
    }

    loadMoreService() {
        this.serviceEnd = this.serviceEnd + 5;
    }
    loadLessService() {
        this.serviceStart = 0;
        this.serviceEnd = 5;
    }

    addToActionPlan(type, id, opt) {
        this.globalState.showLoader = true;
        this.zytoClientWellnessService.AddToActionPlan(this.programId, type, id,opt).subscribe(response => {
            // this.globalState.showLoader = false;
            this.loadFoundation();
            if(this.modalRef)
            this.modalRef.close();
            this.globalState.showMessage('success', 'Added To Action Plan Successfully', 'Success');
        },
            error => {
                this.globalState.showLoader = false;
                this.globalState.showMessage('error', 'Unable To Add To Action Plan', 'Error');
            });

    }

    removeFromActionPlan(type, id) {
        this.globalState.showLoader = true;
        this.zytoClientWellnessService.RemoveFromActionPlan(this.programId, type, id).subscribe(response => {
            // this.globalState.showLoader = false;
            this.loadFoundation();
            this.globalState.showMessage('success', 'Removed From Action Plan Successfully', 'Success');
        },
            error => {
                this.globalState.showLoader = false;
                this.globalState.showMessage('error', 'Unable To Remove From Action Plan', 'Error');
            });
    }
   
    open(content,type,id) {
        console.log('Dist Id',id);
        this.selectedDistId = id;
        const selectedOption = _.find(this.foundationDetail.DistributorProducts,function(res:any){
            if(res.DistributorProduct.Id == id){
                return res;
            }
        });
        this.distOptions = selectedOption.DistributorProduct;
        console.log('Dist Options',this.distOptions);
        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return  `with: ${reason}`;
        }
    }
}