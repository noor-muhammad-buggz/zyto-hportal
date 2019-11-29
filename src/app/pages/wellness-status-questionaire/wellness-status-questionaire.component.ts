import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ZytoService } from '../../services/zyto.service';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import { ZytoScanService } from '../../services/zyto-scan.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { GlobalState } from '../../global.state';

//decalre jquery
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'wellness-status-questionaire',
    templateUrl: './wellness-status-questionaire.component.html',
    styleUrls: ['./wellness-status-questionaire.component.scss', '../../theme/sass/as_custom.css'],
    providers: [ZytoService],
})
export class WellnessStatusQuestionaireComponent implements OnInit, AfterViewInit {
    existing: any;
    response: any;
    clientId: any;
    programId: any;
    sessionId: any;
    loading: boolean = false;
    submitted = false;
    wellnessForm: FormGroup;

    savedResponse: any;
    questionnaireId: any;
    questionnaireResultId: any;
    formSubmited: boolean;
    isSuccessful: boolean;
    isFailed: boolean;
    errors: string[] = [];
    show: any;
    alerts: any[] = [];

    sections: any;
    previousSectionQuestionLength: any = {};
    questionControlArray: any = {};

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
        private _ZytoScanService: ZytoScanService,
        public globalState: GlobalState,
        private fb: FormBuilder
    ) {
        this.globalState.showFullLoader = true;
        this.globalState.showLoader = true;
    }

    ngOnInit() {
        const self = this;

        this.activatedRoute.params.subscribe((params: Params) => {
            this.clientId = params['id'];
            this.programId = params['pid'];
        });

        this.formSubmited = false;
        this.isSuccessful = false;
        this.isFailed = false;
        this.errors = [];

        this.existing = false;
        this.wellnessForm = this.fb.group({
            'QuestionnaireVersion': ['', Validators.required],
            'QuestionResults': this.fb.array([]),
        });
        
        this.zytoClientWellnessService.GetFoundationProgramRun(this.programId).subscribe(response => {
            response.clientId = this.clientId;
            if(response.Status != 'Questionnaire')
            this.globalState.foundationStatus.emit(response);
            
            console.log('foundation response is : ', response);

            this.questionnaireResultId = response.StatusQuestionnaireResultId;
            this.zytoClientWellnessService.GetWellnessStatusQuestionnaireResult(this.questionnaireResultId)
            .subscribe(savedResponse => {
                this.savedResponse = savedResponse;
                this.questionnaireId = savedResponse.QuestionnaireId;
                this.zytoClientWellnessService.GetWellnessStatusQuestionnairesWithDetail(this.questionnaireId).subscribe(response => {
                    // console.log('here is detail response : ',response);
                    self.response = response;
                    this.sections = response.Sections;
                    
                    self.wellnessForm.controls['QuestionnaireVersion'].patchValue(response.AggregateInfo.Version);
                    let control = <FormArray>self.wellnessForm.controls['QuestionResults'];
        
                    var totalQuestions = 0;
                    var qCount = 0;
                    for (const key in this.sections) {
                        const section = this.sections[key];
        
                        section.Questions.forEach(element => {
                            const ans = _.filter(this.savedResponse.QuestionResults,function(answer: any){
                                return (element.Id == answer.Id) ? answer : '';
                            });
                            // console.log(ans);
                            // console.log(element.Id);
                            const formGroup = self.initQuestionResult(element.Id, (ans && ans.length > 0) ? ans[0] : '');
                            control.push(formGroup);
                            element.chunkedResults = (element.ResultRestrictions) ? _.chunk(element.ResultRestrictions.QuestionOptions, 4) : '';
                            element.qIndex = qCount;
                            qCount++;
                        });
                        //control.push(sectionGroup);
                        this.sections[key].totalQuestions = section.Questions.length;
                        this.previousSectionQuestionLength[section.Id] = totalQuestions;
                        totalQuestions += section.Questions.length;
                        // this.wellnessForm.patchValue({
                        //     'QuestionnaireVersion': this.savedResponse.QuestionnaireVersion,
                        //     'QuestionResults': this.savedResponse.QuestionResults
                        // });
                    }
                    this.loading = false;
                      this.globalState.showLoader = false;
        
                });
            });
        });
        // const questionnaireResultId = localStorage.getItem('questionnaireResultId'); 
    }

    setResults(index, value) {
        let fm: any = this.wellnessForm.controls['QuestionResults'];
        if(fm.controls[index].controls['Result'].value !== '') {
            var valArray = fm.controls[index].controls['Result'].value.split(',');
            if(valArray.indexOf(value) >= 0) {
                valArray.splice(valArray.indexOf(value),1);
                fm.controls[index].controls['Result'].patchValue(valArray.join());
            }
            else {
                fm.controls[index].controls['Result'].patchValue(valArray.join()+','+value);
            }
            
        }
        else {
            fm.controls[index].controls['Result'].patchValue(value);
        }
    }

    checkResult(index, value) {
        let fm: any = this.wellnessForm.controls['QuestionResults'];
        fm = fm.controls[index].controls['Result'].value.split(',');
        if(fm.indexOf(value) >= 0){
            return true;
        } else {
            return false;
        }
    }

    initQuestionResult(index, answer) {
        index = index || 0;
        const questionReslutGroup = this.fb.group({
            'Id': [index],
            'Result': [(answer && answer.Result) ? answer.Result : '']
        });
        return questionReslutGroup;
    }

    ngAfterViewInit() {
        this.globalState.currentPage = 'Wellness-Status';
        this.globalState.currentPageTitle = 'Foundations For Wellness';
        this.globalState.currentPageSubTitle = `Health Status Questionnaire`;
        // if (localStorage.getItem('currentSession') && localStorage.getItem('currentSessionClient')) {
        //     const sessionClient = JSON.parse(localStorage.getItem('currentSessionClient'));
        //     const currentSession = JSON.parse(localStorage.getItem('currentSession'));
        //     let date: any = new Date(currentSession.AggregateInfo.LastModifiedDate);
        //     date = `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`;
        //     this.globalState.currentPageSubTitle = `${sessionClient.PersonInfo.Name.FirstName} ${sessionClient.PersonInfo.Name.LastName} | ${date}`;
        // }

    }

    markQuestionZero($event) {
        const abc: any = this.wellnessForm.controls['QuestionResults'];
        if (abc.controls[$event].controls['Result'].value == '') {
            abc.controls[$event].controls['Result'].patchValue(0);
        }
    }

    saveQuestionaire(): void {
        let values = _.cloneDeep(this.wellnessForm.value);
        console.log('Values on submit : ', values);
        if (this.wellnessForm.valid) {
            values.QuestionResults = _.filter(values.QuestionResults, function(item: any){
                return (item.Result !== '');
            });
            console.log('Values on submit : ', values);
            this.globalState.showLoader = true;
            this.globalState.showFullLoader = true;
            this.errors = [];
            const self = this;
            this.zytoClientWellnessService.UpdateQuestionnaireResults(this.questionnaireResultId, values).subscribe(x => {
                this.response = x;
                this.zytoClientWellnessService.MarkQuestionnaireResultsCompleted(this.programId).subscribe(resp1 => {
                    this.globalState.showLoader = false;
                    this.globalState.showFullLoader = false;
                    this.globalState.showMessage('success', 'Questionnaire Results Updated Successfully', 'Success');
                    this.zytoClientWellnessService.GetFoundationProgramRun(this.programId).subscribe(resp1 => {
                        resp1.clientId = this.clientId;
                        this.globalState.foundationStatus.emit(resp1);
                    });
                });
                }, error => {
                    this.globalState.showLoader = false;
                    this.globalState.showFullLoader = false;
                    this.globalState.showMessage('error', error.Message, 'Error')
                }
            );
        }
        else { 
            let el = $('.ng-invalid:not(form):first').parent().parent().parent();
            $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
                el.focus();
            });
            this.globalState.showMessage('error', 'Please fill all required fields', 'Validation Error');
        }
    }
}
