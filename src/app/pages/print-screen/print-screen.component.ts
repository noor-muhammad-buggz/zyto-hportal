import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Params, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-print-screen',
    templateUrl: './print-screen.component.html',
    styleUrls: ['./print-screen.component.scss', '../../theme/sass/as_custom.css']
})
export class PrintScreenComponent implements OnInit {
    model;
    time = { hour: 13, minute: 30 };
    meridian = true;
    prevUrl: string;

    toggleMeridian() {
        this.meridian = !this.meridian;
    }

    foundationId: any;
    programId: any;
    PractitionerForm: FormGroup;
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


    constructor(
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private _ZytoService: ZytoService,
        private zytoClientWellnessService: ZytoClientWellnessService,
        public globalState: GlobalState,
        private fb: FormBuilder,
        private toastrService: ToastrService,
    ) {
        this.globalState.showSidebar = false;
        this.globalState.showLoader = true;
        this.globalState.showFullLoader = true;
        
    }
    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.programId = params['pid'];
        });
        this.prevUrl = localStorage.getItem('prevPrintUrl');

    }

    ngAfterViewInit(): void {
        $('[data-toggle="tooltip"]').tooltip();
        // throw new Error("Method not implemented.");
        this.globalState.currentPage = 'ACTION-PLANS';
        this.globalState.currentPageTitle = 'FOUNDATIONS FOR WELLNESS';
        this.globalState.currentPageSubTitle = 'Action Plan';

        const actionPlan = JSON.parse(localStorage.getItem('ActionPlan'));
        if (!actionPlan) {
            this.zytoClientWellnessService.GetActionPlanDetail(this.programId).subscribe(response => {
                this.loadActionPlan(response);
            }, error => {
                this.globalState.showLoader = false;
            });
        } else {
            this.loadActionPlan(actionPlan);
        }

    }

    loadActionPlan(response) {
        let self = this;

        this.actionPlan = response;
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
            if (foundations.RecommendationQuestionnaire) {
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
            if (foundations.Note) {
                this.actionPlan.hasNotes = true;
            }
        });
        this.globalState.showLoader = false;

        setTimeout(function () {
            // window.print();
            // window.close();
        }, 500);
        console.log('selectedFoundation Summary is : ', this.actionPlan);


    }

    printPlan() {
        var mywindow = window.open('', 'PRINT', 'height=900,width=1200');

        mywindow.document.write('<html><head><title>Action Plan Insight</title>');
        mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" crossorigin="anonymous">');
        mywindow.document.write(`
        <style>

        @media print {
            .print-logo {
                img {
                    width:120px;
                }
            }
            /** BAR CHART **/
            .chart-wrap
            {
                margin: 20px 0 50px 0;
                height: auto;
                background-color: #fff; /**Chart Background**/
                max-width: 100%;
                padding: 0 10px;
            }
            .dataset {
                height: 35px;
                display: block;
                width: 100%;
            }

            .data-lable {
                text-align: right;
                line-height: 33px;
                margin-right: 10px;
            }
            .data-lable a {
                text-transform:  uppercase;
                font-size: 14px;
                color: #5fa6e4;
                text-decoration:  underline;
                font-weight:  700;
            }
            .data-icon {
                width: 33px;
                margin: 3px 15px;
            }

            .data-icon img {
                width: 100%;
            }

            .data-bar {
                height:  30px;
                display:  inline-block;
                vertical-align:  top;
                width: 100%;
                position: relative;
                margin: 5px 0;
            }
            .data-bar::before
            {
                content: '';
                height: 40px;
                width: 6px;
                background-color: #666666;
                position: absolute;
                top: -5px;
            }

            .data-bar-fill {
                height: 30px;
                background-color:  #c6c6c6;
                text-align: right;
                padding: 7px 20px;
                color: #fff;
                cursor: pointer;
                font-size: 12px;
                -webkit-print-color-adjust: exact;
            }
            .data-bar-fill.red {
                -webkit-print-color-adjust: exact;
                background-color:  #be1e2d;
            }
            .data-bar-fill.green {
                -webkit-print-color-adjust: exact;
                background-color:  #009444;
            }
            .data-bar-fill.blue {
                -webkit-print-color-adjust: exact;
                background-color:  #00467e;
            }
            .data-bar-fill.yellow {
                -webkit-print-color-adjust: exact;
                background-color:  #b29002;
            }
            .data-bar-fill.skyblue {
                -webkit-print-color-adjust: exact;
                background-color:  #1890aa;
            }
            .data-bar-fill.purpal {
                -webkit-print-color-adjust: exact;
                background-color:  #7f3f98;
            }
            .dataset-label {
                /* width: 190px; */
                display:  inline-block;
                /* position: absolute; */
                /* left: -190px; */
            }

            .dataset-chart {
                width: 100%;
                position: relative;
            }
            .data-row
            {
                position: relative;
                z-index: 2;
            }
            .chart-bg {
                /* width: 100%; */
                position: absolute;
                top: 0;
                bottom:  0;
                z-index: 1;
            }
            .point {
                height:  100%;
                width: 6px;
                -webkit-print-color-adjust: exact;
                background-color: #dddddd;
                position:  absolute;
                top: 0;
                bottom:  0;
            }
            #point-0 {
                left: 0;
            }

            #point-1 {
                left: calc(10% - 6px);
            }
            #point-2 {
                left: calc(20% - 6px);
            }
            #point-3 {
                left: calc(30% - 6px);
            }
            #point-4 {
                left: calc(40% - 6px);
            }
            #point-5 {
                left: calc(50% - 6px);
            }
            #point-6 {
                left: calc(60% - 6px);
            }
            #point-7 {
                left: calc(70% - 6px);
            }
            #point-8 {
                left: calc(80% - 6px);
            }
            #point-9 {
                left: calc(90% - 6px);
            }
            #point-10 {
                left: calc(100% - 6px);
            }
            .point-value {
                position: absolute;
                bottom: -30px;
                left: -2px;
                color: #5fa6e4;
                font-weight: 600;
            }
            /** END BAR CHART **/

            .lightblue-text
            {
                color: #5fa0d6;
            }
            .darkblue-text
            {
                color: #003979;
            }
            .gray-text
            {
                color: #707070;
            }
            .m-16
            {
                font-weight: 600;
                font-size: 16px;
            }
            .b-16
            {
                font-weight: 700;
                font-size: 16px;
            }
            .n-16
            {
                font-weight: normal;
                font-size: 16px;
            }
            .header-contact-details p
            {
                margin-bottom: 0;
            }
            .print-page {
                max-width: 1100px;
                margin:  0 auto;
            }
            .pattern-image
            {
                position: relative:
                right: -20px;
            }
            .pattern-image img {
                max-width: 100%;
            }
            .header-contact-details {
                border-left: 2px solid #bedffa;
                padding: 25px 20px;
            }
            
            .header-right-text {
                margin-bottom: 20px;
                padding: 20px 0;
            }
            .header-right-text h1 {
                font-size: 28px;
                font-weight:  700;
                text-transform: uppercase;
                color: #5fa0d6;
                margin-bottom: 0;
                padding-bottom: 5px;
                border-bottom: 2px solid #bedffa;
            }
            .header-right-text h3 {
                font-size: 20px;
                font-weight:  600;
                color: #5fa0d6;
            }
            
            .chart-wrap {
                margin: 80px auto;
                padding: 0 30px;
            }
            .iconic-heading {
                font-size:  20px;
                text-transform:  uppercase;
            }
            
            .iconic-heading img {
                margin-right:  10px;
                position:  relative;
                top: -3px;
            }
            .icons-wth-value {
                list-style:  none;
                padding-left:  0;
                margin-bottom:  0;
            }
            
            .icons-wth-value li {
                display:  inline-block;
            }
            
            .icons-wth-value li img {
                display:  block;
            }
            
            .icons-wth-value li .icon-value {
                display:  block;
                text-align:  center;
                font-weight:  700;
                color: #003979;
                font-size: 14px;
            }
            
            .accordian-caret {
                display:  inline-block;
                vertical-align:  middle;
            }
            
            .card-header-text {
                display:  inline-block;
                margin-left: 10px;
                margin-bottom: 0;
                vertical-align:  middle;
                color: #003a70;
                font-weight: 600;
                font-size: 19px;
            }

            .as-accordian .card-header {
                -webkit-print-color-adjust: exact;
                background-color: #bcdcf3;
                padding: 20px 25px;
                height: 60px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
            .as-accordian .card-header.pt-3
            {
                padding: 3px 25px !important;
            }
            .as-accordian .card {
                border: none;
            }
            
            .as-accordian .card-body {
                border: 1px solid #ddd;
                border-top:  none;
                padding: 20px;
            }
            
            .pr-list-block {
                margin-bottom:;
                margin-bottom:  10px;
            }
            
            .pr-list-block .row {
                padding-left: 20px;
            }
            
            .accordians-main {
                margin-bottom: 40px;
            }
            
            .note-h-p {
                margin-bottom: 10px;
            }
            
            .note-h {
                margin-bottom: 0;
            }
            
            .note-p {
                padding-left: 20px;
            }
            
            .acc-price h3 {
                font-weight: 600;
                color: #727272;
                text-align: right;
                font-size: 22px;
            }

            /** BOOTSTRAP CLASSES **/

            .row {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                margin-right: -15px;
                margin-left: -15px;
            }
            .align-items-center {
                -webkit-box-align: center !important;
                -ms-flex-align: center !important;
                align-items: center !important;
            }
            .no-gutters {
                margin-right: 0;
                margin-left: 0;
            }
            .no-gutters > .col, .no-gutters > [class*="col-"] {
                padding-right: 0;
                padding-left: 0;
            }
            .col-lg-6 {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 50%;
                flex: 0 0 50%;
                max-width: 50%;
                position: relative;
                width: 100%;
                min-height: 1px;
            }
            .col-md-auto {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 auto;
                flex: 0 0 auto;
                width: auto;
            }
            .col-md {
                -ms-flex-preferred-size: 0;
                flex-basis: 0;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                max-width: 100%;
                position: relative;
                width: 100%;
                min-height: 1px;
            }
            .justify-content-between {
                -webkit-box-pack: justify !important;
                -ms-flex-pack: justify !important;
                justify-content: space-between !important;
            }
            .d-flex {
                display: -webkit-box !important;
                display: -ms-flexbox !important;
                display: flex !important;
            }
            .col-lg {
                -ms-flex-preferred-size: 0;
                flex-basis: 0;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                max-width: 100%;
            }
            .col-lg-4 {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 33.33333333%;
                flex: 0 0 33.33333333%;
                max-width: 33.33333333%;
            }
            .col-lg-auto {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 auto;
                flex: 0 0 auto;
                width: auto;
            }
            .col-lg-2 {
                -webkit-box-flex: 0;
                -ms-flex: 0 0 16.66666667%;
                flex: 0 0 16.66666667%;
                max-width: 16.66666667%;
            }
        }

        </style>
        `);
        // page-break-before:always;
        mywindow.document.write('</head><body>');
        mywindow.document.write(document.getElementById('a-print-screen').innerHTML);
        mywindow.document.write(`</body></html>`);

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        setTimeout(function () {
            mywindow.print();
            mywindow.close();
        }, 500);

        return true;
    }
}
