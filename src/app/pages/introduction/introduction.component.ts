import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalState } from '../../global.state';
import { UserService } from '../../services/user.service';
import { ZytoService } from '../../services/zyto.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
    selector: 'app-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit, AfterViewInit {

    loading: boolean = false;
    trainingVideo = {
        isCompleted: false,
        lastState: 0,
    };
    accountDetail: any;
    videos: any[];


    constructor(
        public router: Router,
        private userService: UserService,
        private ZytoService: ZytoService,
        public globalState: GlobalState,
    ) {
        this.ZytoService.GetAccountById().subscribe(x => {
            localStorage.setItem('accountDetail', JSON.stringify(x));
            this.accountDetail = x;
        });
    }

    ngOnInit() {
        console.log('IntroductionComponent -> ngOnInit');

        this.videos = [
            {
                id: 0,
                url: '',
                label: '',
                visible: true,
            },
            {
                id: 1,
                url: environment.TrainingResourceBaseUrl + '/training1.mp4',
                label: 'How to analyze the data',
                visible: false,
            },
            {
                id: 2,
                url: environment.TrainingResourceBaseUrl + "/training2.mp4",
                label: 'How to implement the Wellness Programs in your business',
                visible: false,
            },
            {
                id: 3,
                url: environment.TrainingResourceBaseUrl + "/training3.mp4",
                label: 'How to view client details',
                visible: false,
            }];

        if (this.accountDetail !== null) {
            const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
            const profile = JSON.parse(localStorage.getItem('userProfile'));
            this.videos[0].label = profile.user_metadata && profile.user_metadata.name || profile.nickname;
            if (accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training && accountDetail.HealthProfessional.Training.Milestones) {
                this.trainingVideo.lastState = Math.max.apply(Math, accountDetail.HealthProfessional.Training.Milestones.map(function (o) { return parseInt(o.Id); }));
                console.log(this.trainingVideo.lastState);
                this.trainingVideo.lastState += 1; //to play next video
                this.trainingVideo.lastState = (this.trainingVideo.lastState > 3) ? 3 : this.trainingVideo.lastState;
            }
            if (accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training && accountDetail.HealthProfessional.Training.Completed) {
                this.trainingVideo.lastState = 0;
            }
        } else {
            this.trainingVideo.lastState = 0;
        }
        this.showVideo(this.trainingVideo.lastState);
    }

    ngAfterViewInit(): void {
        if (this.accountDetail !== null) {
            const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
            if (accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training && accountDetail.HealthProfessional.Training.Completed) {
                this.globalState.trainingAlreadyCompleted.emit(true);
            }
        }
        this.globalState.showLoader = false;
        console.log(this.trainingVideo.lastState);
    }

    showVideo(id) {
        switch (id) {
            case 0:
                this.videos[0].visible = true;
                this.videos[1].visible = false;
                this.videos[2].visible = false;
                this.videos[3].visible = false;
                this.trainingVideo.lastState = 0;
                break;
            case 1:
                this.videos[0].visible = false;
                this.videos[1].visible = true;
                this.videos[2].visible = false;
                this.videos[3].visible = false;
                this.trainingVideo.lastState = 1;
                break;
            case 2:
                this.videos[0].visible = false;
                this.videos[1].visible = false;
                this.videos[2].visible = true;
                this.videos[3].visible = false;
                this.trainingVideo.lastState = 2;
                break;
            case 3:
                this.videos[0].visible = false;
                this.videos[1].visible = false;
                this.videos[2].visible = false;
                this.videos[3].visible = true;
                this.trainingVideo.lastState = 3;
                break;
        }
    }

    stepCompleted() {
        console.log('in stepCompleted');
        this.loading = true;
        this.globalState.showLoader = true;
        this.trainingVideo = {
            isCompleted: true,
            lastState: 3,
        };


        let userOperation1: Observable<any>;
        console.log(this.trainingVideo.lastState);
        userOperation1 = this.userService.AddHealthProfessionalTrainingMilestone(this.trainingVideo.lastState);

        const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
        if (accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training && accountDetail.HealthProfessional.Training.Milestones) {
            console.log(this.trainingVideo.lastState)
            console.log(accountDetail)
            const ms = accountDetail.HealthProfessional.Training.Milestones;
            if (!ms.find(x => { return (x.Id == this.trainingVideo.lastState) })) {
                userOperation1.subscribe(
                    response => {
                        console.log(response);

                        this.completedTrainingAndRedirect();
                    },
                    err => {
                        console.log(err);
                        this.completedTrainingAndRedirect();
                    });
            } else {
                this.completedTrainingAndRedirect();
            }
        } else {
            userOperation1.subscribe(
                response => {
                    console.log(response);

                    this.completedTrainingAndRedirect();
                },
                err => {
                    console.log(err);
                    this.completedTrainingAndRedirect();
                });
        }


    }

    completedTrainingAndRedirect() {
        console.log('in completedTrainingAndRedirect');
        let userOperation2: Observable<any>;
        const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
        if (accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training) {
            if (!accountDetail.HealthProfessional.Training.Completed) {
                userOperation2 = this.userService.MarkHealthProfessionalTrainingComplete();
                userOperation2.subscribe(
                    response => {
                        console.log(response);
                        this.router.navigate(['/']);
                    },
                    err => {
                        console.log(err);
                        //this.router.navigate(['/']);
                    });
            } else {
                this.router.navigate(['/']);
            }
        }

        this.loading = false;
        this.globalState.showLoader = false;
        this.router.navigate(['/']);
    }

    nextStep() {
        console.log(this.trainingVideo.lastState);
        const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
        // console.log(accountDetail.HealthProfessional.Training.Milestones[this.trainingVideo.lastState--]);
        let userOperation: Observable<any>;
        if (accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training && accountDetail.HealthProfessional.Training.Milestones) {
            console.log(this.trainingVideo.lastState)
            console.log(accountDetail)
            const ms = accountDetail.HealthProfessional.Training.Milestones;
            if (!ms.find(x => { return (x.Id == this.trainingVideo.lastState) })) {
                userOperation = this.userService.AddHealthProfessionalTrainingMilestone(this.trainingVideo.lastState);
                userOperation.subscribe(
                    response => {
                        console.log(response);
                    },
                    err => {
                        console.log(err);
                    });
            }
        } else {
            userOperation = this.userService.AddHealthProfessionalTrainingMilestone(this.trainingVideo.lastState);
            userOperation.subscribe(
                response => {
                    console.log(response);
                },
                err => {
                    console.log(err);
                });
        }


        if (this.trainingVideo.lastState < 3)
            this.trainingVideo.lastState += 1;
        this.showVideo(this.trainingVideo.lastState);
    }

    previousStep() {
        if (this.trainingVideo.lastState > 0)
            this.trainingVideo.lastState -= 1;
        this.showVideo(this.trainingVideo.lastState);
    }

    getVideoTitle(videoId: any) {
        const video = _.find(this.videos, function (o) { return o.id === videoId; });
        return (video && video.label) ? video.label : '';
    }

    startTraining() {
        this.trainingVideo.lastState += 1;
        this.showVideo(this.trainingVideo.lastState);
    }

}
