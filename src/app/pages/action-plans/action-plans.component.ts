import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Params, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-action-plans',
    templateUrl: './action-plans.component.html',
    styleUrls: ['./action-plans.component.scss', '../../theme/sass/as_custom.css']
})
export class ActionPlansComponent implements OnInit, AfterViewInit {
    foundationId: any;
    programId: any;
    StatusForm: FormGroup;
    PractitionerForm: FormGroup;
    formSubmited: boolean;
    selectedFoundation: any;

    actionPlan: any;
    start: any = 0;
    end: any = 5;
    serviceStart: any = 0;
    serviceEnd: any = 5;
    statusEdit: boolean = false;
    practitionerEdit: boolean = false;
    notesEdit: boolean = false;
    StatusSections: any;
    PractitionerSections: any;
    previousSectionQuestionLength: any = {};
    clientId: any;
    questionnaireResultId: any;
    recommendationResultId: any;
    url: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private _ZytoService: ZytoService,
        private zytoClientWellnessService: ZytoClientWellnessService,
        public globalState: GlobalState,
        private fb: FormBuilder,
        private toastrService: ToastrService,
    ) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                console.log('prev:', e);
                this.url = e;
            });
        this.globalState.showSidebar = true;
        this.globalState.showLoader = true;
    }
    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.programId = params['pid'];
        });

        this.loadActionPlan();
    }

    ngAfterViewInit(): void {
        $('[data-toggle="tooltip"]').tooltip();
        // throw new Error("Method not implemented.");
        this.globalState.currentPage = 'ACTION-PLANS';
        this.globalState.currentPageTitle = 'FOUNDATIONS FOR WELLNESS';
        this.globalState.currentPageSubTitle = 'Action Plan';

    }

    loadActionPlan() {
        let self = this;
        this.zytoClientWellnessService.GetActionPlanDetail(this.programId).subscribe(response => {
            this.actionPlan = response;
            localStorage.setItem('ActionPlan', JSON.stringify(response));
            if (this.actionPlan.DistributorProducts) {
                this.actionPlan.DistributorProducts.forEach(element => {
                    if (element.FoundationIds) {
                        element.actionPlan = [];
                        element.FoundationIds.forEach(foundation => {
                            let filterResult = _.filter(this.actionPlan.Foundations, function (elem: any) {
                                if (elem.Id == foundation) {
                                    return elem;
                                }
                            });
                            element.actionPlan.push(filterResult[0]);
                        });
                    }
                });
            }
            if (this.actionPlan.Services) {
                this.actionPlan.Services.forEach(element => {
                    if (element.FoundationIds) {
                        element.actionPlan = [];
                        element.FoundationIds.forEach(foundation => {
                            let filterResult = _.filter(this.actionPlan.Foundations, function (elem: any) {
                                if (elem.Id == foundation) {
                                    return elem;
                                }
                            });
                            element.actionPlan.push(filterResult[0]);
                        });
                    }
                });
            }
            this.actionPlan.hasAnswers = false;
            this.actionPlan.hasNotes = false;
            this.actionPlan.Foundations.forEach(foundations => {
                if(foundations.RecommendationQuestionnaire){
                    foundations.RecommendationQuestionnaire.Section.Questions.forEach(element => {
                        const result = _.find(foundations.RecommendationQuestionnaireResults.QuestionResults, function (res: any) {
                            if (res.Id == element.Id) {
                                return res;
                            }
                        });
                        if (result) {
                            foundations.hasAnswers = true;
                            let resultArray = result.Result.split(',');
                            if (element.ResultRestrictions) {
                                console.log('options', element.ResultRestrictions.QuestionOptions);
                                let ans = _.filter(element.ResultRestrictions.QuestionOptions, function (answer: any) {
                                    if (resultArray.indexOf(answer.Id) >= 0) {
                                        return answer;
                                    }
                                });
                                ans = _.map(ans, 'Name');
                                element.answer = ans.join(', ');
                            } else {
                                element.answer = result.Result;
                            }
                            this.actionPlan.hasAnswers = true;
                        } else {
                            foundations.hasAnswers = false;
                        }
                    });
                }
                if(foundations.Note){
                    this.actionPlan.hasNotes = true;
                }
            });
            
            this.globalState.showLoader = false;
            console.log('selectedFoundation Summary is : ', this.actionPlan);
        },
            error => {
                this.globalState.showLoader = false;
            });

    }

    prepareSalesOrder() {
        if(this.actionPlan.DistributorProducts){
            this.globalState.showLoader = true;
            let res = _.filter(this.actionPlan.DistributorProducts,function(elem:any){
                if(!elem.DistributorProduct.InStock){
                    return elem;
                }
            });
            
            // this.toastrService.success("<br /><br /><button type='button' id='confirmationRevertYes' class='btn clear'>Yes</button>delete item?", 'title', { enableHtml: true,onActivateTick: true});
            if(res.length > 0){
                // let test:Partial> = 'asd';

                // this.globalState.showMessage('info','Some of the items in your action plan are currently out stock. Out of stock items will not be added to you cart.','Error');
                if(confirm('Some of the items in your action plan are currently out stock. Out of stock items will not be added to you cart.')){
                    // return true;
                } else {
                    this.globalState.showLoader = false;
                    return false;
                }
            }
            this._ZytoService.PrepareSalesOrder(this.programId).subscribe(response => {
                this.zytoClientWellnessService.GetActionPlanDetail(this.programId).subscribe(response => {
                    localStorage.setItem('ActionPlan', JSON.stringify(response));
                    let orderId = (response.PendingSalesOrder) ? response.PendingSalesOrder.Id : '';
                    let ClientId = (response.PendingSalesOrder) ? response.PendingSalesOrder.ClientId : '';
                    const self = this;
                    this.globalState.showLoader = false;
                    self.router.navigate(['/pages/client/',ClientId , 'sessions', this.programId, 'checkout-cart', orderId]);
                }, error => {
                    this.globalState.showMessage('error', error.Message, 'Error');
                    this.globalState.showLoader = false;
                });
            }, error => {
                console.log(error);
                this.globalState.showMessage('error', error.Message, 'No Supplements in Action Plan');
                this.globalState.showLoader = false;
            });
        }
       
    }

    removeFromActionPlan(type, id) {
        this.globalState.showLoader = true;
        this.zytoClientWellnessService.RemoveFromActionPlan(this.programId, type, id).subscribe(response => {
            // this.globalState.showLoader = false;
            this.loadActionPlan();
            this.globalState.showMessage('success', 'Removed From Action Plan Successfully', 'Success');
        },
        error => {
            this.globalState.showLoader = false;
            this.globalState.showMessage('error', 'Unable To Remove From Action Plan', 'Error');
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

    goToPrint(){
        localStorage.setItem('prevPrintUrl',this.url.url);
        this.router.navigate(['/pages/sessions',this.programId,'action-plan-print']);
    }
}

