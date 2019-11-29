import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-system-detail',
    templateUrl: './system-detail.component.html',
    styleUrls: ['./system-detail.component.scss', '../../theme/sass/as_custom.css']
})
export class SystemDetailComponent implements OnInit, AfterViewInit {

    existing: any;
    response: any;
    systemId: any;
    programId: any;
    foundationId: any;
    loading: boolean = false;
    submitted = false;
    wellnessForm: FormGroup;
    savedResponse: any;
    formSubmited: boolean;
    isSuccessful: boolean;
    isFailed: boolean;
    errors: string[] = [];
    show: any;
    selectedSystem: any;

    systemDetail: any;
    start: any = 0;
    end: any = 5;
    serviceStart: any = 0;
    serviceEnd: any = 5;
    closeResult: string;
    distOptions: any;
    selectedOption: any = "";
    selectedDistId: any = "";

    private modalRef: NgbModalRef;
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

    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.foundationId = params['fid'];
            this.systemId = params['sid'];
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
        let self = this;
        this.zytoClientWellnessService.GetSystemDetail(this.programId, this.systemId, this.foundationId).subscribe(response => {
            this.systemDetail = response;
            if (this.systemDetail.DistributorProducts) {
                this.systemDetail.DistributorProducts.forEach(element => {
                    if (element.FoundationIds) {
                        element.FoundationDetail = [];
                        element.FoundationIds.forEach(foundation => {
                            let filterResult = _.filter(this.systemDetail.Foundations, function (elem: any) {
                                if (elem.Id == foundation) {
                                    return elem;
                                }
                            });
                            element.FoundationDetail.push(filterResult[0]);
                        });
                    }
                });
            }
            if (this.systemDetail.Services) {
                this.systemDetail.Services.forEach(element => {
                    if (element.FoundationIds) {
                        element.FoundationDetail = [];
                        element.FoundationIds.forEach(foundation => {
                            let filterResult = _.filter(this.systemDetail.Foundations, function (elem: any) {
                                if (elem.Id == foundation) {
                                    return elem;
                                }
                            });
                            element.FoundationDetail.push(filterResult[0]);
                        });
                    }
                });
            }
            let filterResult = _.filter(this.systemDetail.Foundations, function (elem: any) {
                if (elem.Id == self.foundationId) {
                    return elem;
                }
            });
            this.selectedSystem = filterResult[0];

            console.log('selectedFoundation Summary is : ', this.systemDetail);
            this.globalState.showLoader = false;
        },error => {
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
            if(this.modalRef)
            this.modalRef.close();
            this.loadFoundation();
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
        const selectedOption = _.find(this.systemDetail.DistributorProducts,function(res:any){
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
