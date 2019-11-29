import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { ZytoClientWellnessService } from '../../services/zyto-client-wellness.service';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-foundation-detail',
    templateUrl: './foundation-detail.component.html',
    styleUrls: ['./foundation-detail.component.scss', '../../theme/sass/as_custom.css']
})
export class FoundationDetailComponent implements OnInit, AfterViewInit {

    foundationId: any;
    programId: any;
    StatusForm: FormGroup;
    PractitionerForm: FormGroup;
    statusFormTemp: any;
    selectedFoundation: any;

    foundationDetail: any;
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
    notesForm: FormGroup;
    note: any;
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
            this.programId = params['pid'];
        });
        this.StatusForm = this.fb.group({
            'QuestionnaireVersion': ['', Validators.required],
            'QuestionResults': this.fb.array([]),
        });
        this.PractitionerForm = this.fb.group({
            'QuestionnaireVersion': ['', Validators.required],
            'QuestionResults': this.fb.array([]),
        });
        this.notesForm = this.fb.group({
            'Note': ['', Validators.required],
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
        this.zytoClientWellnessService.GetFoundationDetail(this.programId, this.foundationId).subscribe(response => {
            this.clientId = response.Client.Id;
            this.questionnaireResultId = response.StatusQuestionnaireResults.Id;
            this.recommendationResultId = response.RecommendationQuestionnaireResults.Id;
            
            
            this.foundationDetail = response;
            this.StatusSections = this.foundationDetail.StatusQuestionnaire.Section;
            this.PractitionerSections = this.foundationDetail.RecommendationQuestionnaire.Section;
            this.note = this.foundationDetail.Note;
            this.notesForm.patchValue({
                Note: this.foundationDetail.Note,
            });
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
            let filterResult = _.filter(this.foundationDetail.Foundations, function (elem: any) {
                if (elem.Id == self.foundationId) {
                    return elem;
                }
            });

            this.selectedFoundation = filterResult[0];
            
            
            console.log('selectedFoundation Summary is : ', this.foundationDetail);
            // Prepare form for status questions

            if(this.foundationDetail.StatusQuestionnaire){
                self.StatusForm.controls['QuestionnaireVersion'].patchValue(this.foundationDetail.StatusQuestionnaire.AggregateInfo.Version);
                let control = <FormArray>self.StatusForm.controls['QuestionResults'];

                var totalQuestions = 0;
                var qCount = 0;
                this.StatusSections.hasAnswers = false;
                this.StatusSections.Questions.forEach(element => {
                    const ans = _.filter(this.foundationDetail.StatusQuestionnaireResults.QuestionResults, function (answer: any) {
                        return (element.Id == answer.Id) ? answer : '';
                    });
                    let result = (ans && ans.length > 0) ? ans[0] : null;

                    if(result){
                        console.log('result',result);
                        let resultArray = result.Result.split(',');
                        if(element.ResultRestrictions){
                            console.log('options',element.ResultRestrictions.QuestionOptions);
                            let ans = _.filter(element.ResultRestrictions.QuestionOptions,function(answer: any){
                                let temp = '';
                                if(resultArray.indexOf(answer.Id) >= 0){
                                    return answer;
                                }
                            });
                            console.log('answer',ans);
                            ans = _.map(ans, 'Name');
                            element.answer = ans.join(', ');
                        } else {
                            element.answer = result.Result;
                        }
                        this.StatusSections.hasAnswers = true;
                    }
                    // console.log(ans);
                    // console.log(element.Id);
                    const formGroup = self.initQuestionResult(element.Id, (ans && ans.length > 0) ? ans[0] : null);
                    control.push(formGroup);
                    element.chunkedResults = (element.ResultRestrictions) ? _.chunk(element.ResultRestrictions.QuestionOptions, 4) : '';
                    element.qIndex = qCount;
                    qCount++;
                });
                //control.push(sectionGroup);
                this.StatusSections.totalQuestions = this.StatusSections.Questions.length;
                this.previousSectionQuestionLength[this.StatusSections.Id] = totalQuestions;
                totalQuestions += this.StatusSections.Questions.length;
                
            } 
            
            if(this.foundationDetail.RecommendationQuestionnaire){
                self.PractitionerForm.controls['QuestionnaireVersion'].patchValue(this.foundationDetail.RecommendationQuestionnaire.AggregateInfo.Version);
                let control = <FormArray>self.PractitionerForm.controls['QuestionResults'];

                var totalQuestions = 0;
                var qCount = 0;
                this.PractitionerSections.hasAnswers = false;
                this.PractitionerSections.Questions.forEach(element => {
                    const ans = _.filter(this.foundationDetail.RecommendationQuestionnaireResults.QuestionResults, function (answer: any) {
                        return (element.Id == answer.Id) ? answer : '';
                    });
                    console.log(ans);
                    let result = (ans && ans.length > 0) ? ans[0] : null;
                    if(result){
                        let resultArray = result.Result.split(',');
                        if(element.ResultRestrictions){
                            console.log('options',element.ResultRestrictions.QuestionOptions);
                            let ans = _.filter(element.ResultRestrictions.QuestionOptions,function(answer: any){
                                if(resultArray.indexOf(answer.Id) >= 0){
                                    return answer;
                                }
                            });
                            ans = _.map(ans, 'Name');
                            element.answer = ans.join(', ');
                        } else {
                            element.answer = result.Result;
                        }
                        this.PractitionerSections.hasAnswers = true;
                    }
                    // console.log(element.Id);
                    const formGroup = self.initQuestionResult(element.Id, (ans && ans.length > 0) ? ans[0] : null);
                    control.push(formGroup);
                    element.chunkedResults = (element.ResultRestrictions) ? _.chunk(element.ResultRestrictions.QuestionOptions, 4) : '';
                    element.qIndex = qCount;
                    qCount++;
                });
                //control.push(sectionGroup);
                this.PractitionerSections.totalQuestions = this.PractitionerSections.Questions.length;
                this.previousSectionQuestionLength[this.PractitionerSections.Id] = totalQuestions;
                totalQuestions += this.PractitionerSections.Questions.length;
           
            }    
            console.log('Practitioner questiones',this.foundationDetail);
            this.globalState.showLoader = false;
        },
        error => {
            this.globalState.showLoader = false;
        });
        
    }

    initQuestionResult(index, answer) {
        console.log(answer);
        index = index || 0;
        const questionReslutGroup = this.fb.group({
            'Id': [index],
            'Result': [(answer && answer.Result && answer.Result != '') ? answer.Result : null]
        });
        return questionReslutGroup;
    }

    setResults(index, value) {
        let fm: any = this.StatusForm.controls['QuestionResults'];
        if(fm.controls[index].controls['Result'].value && fm.controls[index].controls['Result'].value !== '') {
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
        let fm: any = this.StatusForm.controls['QuestionResults'];
        if(fm.controls[index].controls['Result'].value && fm.controls[index].controls['Result'].value !== '') {
            fm = fm.controls[index].controls['Result'].value.split(',');
            if(fm.indexOf(value) >= 0){
                return true;
            } else {
                return false;
            }
        }
    }

    setResults1(index, value) {
        value = (value && value !== '') ? value : null;
        let fm: any = this.PractitionerForm.controls['QuestionResults'];
        if(fm.controls[index].controls['Result'].value && fm.controls[index].controls['Result'].value !== '') {
            console.log('step 1',fm.controls[index].controls['Result'].value);
            var valArray = fm.controls[index].controls['Result'].value.split(',');
            if(valArray.indexOf(value) >= 0) {
                console.log('step 3');
                valArray.splice(valArray.indexOf(value),1);
                fm.controls[index].controls['Result'].patchValue(valArray.join());
            }
            else {
                console.log('step 4');
                fm.controls[index].controls['Result'].patchValue(valArray.join()+','+value);
            }
            
        }
        else {
            console.log('step 2');
            fm.controls[index].controls['Result'].patchValue(value);
        }
    }
    checkResult1(index, value) {
        // console.log(value);
        // console.log(index);
        let fm: any = this.PractitionerForm.controls['QuestionResults'];
        if(fm.controls[index].controls['Result'].value && fm.controls[index].controls['Result'].value !== '') {
            fm = fm.controls[index].controls['Result'].value.split(',');
            if(fm.indexOf(value) >= 0){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
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

    statusEditToggle() {
        console.log(this.statusFormTemp);
        console.log(this.StatusForm);
        this.StatusForm = this.statusFormTemp;
        this.statusEdit = !this.statusEdit;
    }

    practitionerEditToggle() {
        this.practitionerEdit = !this.practitionerEdit;
    }

    notesEditToggle() {
        this.notesEdit = !this.notesEdit;
    }

    saveQuestionaire(): void {
        let values = _.cloneDeep(this.StatusForm.value);
        values.QuestionResults.forEach(item => {
            if(item.Result == ''){
                item.Result = null;
            }
        });
        console.log('Values on submit : ', values.QuestionResults);
        if (this.StatusForm.valid) {
            // values.QuestionResults = _.filter(values.QuestionResults, function(item: any){
            //     return (item.Result !== '');
            // });
            console.log('Values on submit : ', values);
            this.globalState.showLoader = true;
            this.globalState.showFullLoader = true;
            const self = this;
            this.zytoClientWellnessService.UpdateQuestionnaireResults(this.questionnaireResultId, values).subscribe(response => {
                // this.response = x;
                    this.foundationDetail.StatusQuestionnaire.Section.hasAnswers = false;
                    this.foundationDetail.StatusQuestionnaire.Section.Questions.forEach(element => {
                        const result = _.find(response.QuestionResults,function(res: any){
                            if(res.Id == element.Id){
                                return res;
                            }
                        });
                        if(result){
                            let resultArray = result.Result.split(',');
                            if(element.ResultRestrictions){
                                console.log('options',element.ResultRestrictions.QuestionOptions);
                                let ans = _.filter(element.ResultRestrictions.QuestionOptions,function(answer: any){
                                    if(resultArray.indexOf(answer.Id) >= 0){
                                        return answer;
                                    }
                                });
                                ans = _.map(ans, 'Name');
                                element.answer = ans.join(', ');
                            } else {
                                element.answer = result.Result;
                            }
                            this.foundationDetail.StatusQuestionnaire.Section.hasAnswers = true;
                        }
                        
                    });
                    this.globalState.showLoader = false;
                    this.globalState.showFullLoader = false;
                    this.statusEdit = false;
                    this.globalState.showMessage('success', 'Status Questionnaire Updated Successfully', 'Success');

            });
        }
        else { 
            let el = $('.ng-invalid:not(form):first').parent().parent().parent();
            $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
                el.focus();
            });
            this.globalState.showMessage('error', 'Please fill all required fields', 'Validation Error');
        }
    }

    savePractitionerQuestionaire(): void {
        let values = _.cloneDeep(this.PractitionerForm.value);
        // values.QuestionResults = _.filter(values.QuestionResults,function(elem:any){
        //     if(elem.Result){
        //         return elem;
        //     }
        // });
        console.log('Values on submit : ', values);
        if (this.PractitionerForm.valid) {
            // values.QuestionResults = _.filter(values.QuestionResults, function(item: any){
            //     return (item.Result !== '');
            // });
            values.QuestionResults.forEach(item => {
                if(item.Result == ''){
                    item.Result = null;
                }
            });
            console.log('Values on submit : ', values);
            this.globalState.showLoader = true;
            this.globalState.showFullLoader = true;
            const self = this;
            this.zytoClientWellnessService.UpdateQuestionnaireResults(this.recommendationResultId, values).subscribe(response => {
                // this.response = x;
                    this.foundationDetail.RecommendationQuestionnaire.Section.hasAnswers = false;
                    if(response.QuestionResults && response.QuestionResults.length >= 0){
                        this.foundationDetail.RecommendationQuestionnaire.Section.Questions.forEach(element => {
                            const result = _.find(response.QuestionResults,function(res: any){
                                if(res.Id == element.Id){
                                    return res;
                                }
                            });
                            if(result){
                                let resultArray = result.Result.split(',');
                                if(element.ResultRestrictions){
                                    console.log('options',element.ResultRestrictions.QuestionOptions);
                                    let ans = _.filter(element.ResultRestrictions.QuestionOptions,function(answer: any){
                                        if(resultArray.indexOf(answer.Id) >= 0){
                                            return answer;
                                        }
                                    });
                                    ans = _.map(ans, 'Name');
                                    element.answer = ans.join(', ');
                                } else {
                                    element.answer = result.Result;
                                }
                                this.foundationDetail.RecommendationQuestionnaire.Section.hasAnswers = true;
                            }
                        });
                    } else {
                        this.foundationDetail.RecommendationQuestionnaire.Section.hasAnswers = false;
                    }
                    this.globalState.showLoader = false;
                    this.globalState.showFullLoader = false;
                    this.practitionerEdit = false;
                    this.globalState.showMessage('success', 'Practitioner Questionnaire Updated Successfully', 'Success');

            }, error => {
                this.globalState.showLoader = false;
                this.globalState.showFullLoader = false;
                this.globalState.showMessage('error',(error.length > 0) ? error[0].Message : JSON.parse(error),'Error');
            });
        }
        else { 
            let el = $('.ng-invalid:not(form):first').parent().parent().parent();
            $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
                el.focus();
            });
            this.globalState.showMessage('error', 'Please fill all required fields', 'Validation Error');
        }
    }
    notesSave():void {
        let values = _.cloneDeep(this.notesForm.value);
        console.log('Values on submit : ', values);
        if (this.notesForm.valid) {
            this.globalState.showLoader = true;
            this.globalState.showFullLoader = true;
            const self = this;
            this.zytoClientWellnessService.UpdateNotes(this.programId,this.foundationId,values).subscribe(response => {
                // this.response = x;
                const result = _.find(response.ActionPlan.Foundations,function(elem:any){
                    if(elem.Id == self.foundationId){
                        return elem;
                    }
                });
                console.log(result);
                if(result && result.Note)
                this.note = result.Note;
                this.notesEdit = false;
                this.globalState.showLoader = false;
                this.globalState.showFullLoader = false;
                this.globalState.showMessage('success', 'Note Updated Successfully', 'Success');
            });
        }
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
