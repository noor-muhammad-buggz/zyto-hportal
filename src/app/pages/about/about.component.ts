import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GlobalState } from '../../global.state';
import { ZytoService } from '../../services/zyto.service';
import * as moment from 'moment';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {

    aboutData: any;
    continuationToken: any;
    TotalRecord: any;
    throttle = 50;
    scrollDistance = 0;
    scrollUpDistance = 2;
    direction = '';

    constructor(public globalState: GlobalState, private zytoService: ZytoService) {
        this.globalState.showLoader = true;
    }

    ngOnInit() {
        this.zytoService.GetAboutPage()
            .subscribe(
                response => {
                    let headers = response.headers;
                    this.continuationToken = headers.get('continuation-token');
                    console.log(headers);
                    response = response.json();

                    let year: any = '';
                    if (response.length > 0) {
                        console.log(response);
                        this.aboutData = response;
                    }
                    this.globalState.currentPage = "support";
                    // this.globalState.currentPageTitle = `VALO VER ${(this.aboutData && this.aboutData) ? this.aboutData[0].Id : ''}`;
                    this.globalState.currentPageTitle = "Support";
                    // this.globalState.currentPageSubTitle = `Release Date ${year}`;
                    this.globalState.showLoader = false;
                    this.globalState.showFullLoader = false;
                },
                error => { }
            );
            // .subscribe(x => {
            //     this.aboutData = x && x[0];
            //     if (this.aboutData && this.aboutData.length > 0) {
            //         this.globalState.currentPageTitle = (this.aboutData.Id) ? `ZYTO VER ${this.aboutData.Id}` : null;
            //         let date = moment(this.aboutData.ReleaseDate).utc(true).toDate();
            //         const year = date.getFullYear();
            //         this.globalState.currentPageSubTitle = `Release Date ${year}`;
            //     }
            //     this.globalState.showLoader = false;
            // });
    }

    ngAfterViewInit() {
        // console.log('in ngAfterViewInit');
        // this.globalState.currentPage = 'about';
        // this.globalState.currentPageTitle = 'ZYTO VER 1.0.3.2';
        // const year = moment.utc().local();
        // this.globalState.currentPageSubTitle = `Release Date ${year.format('YYYY')}`;
    }

    onScrollDown() {
        console.log('asd',this.continuationToken);
        if(this.continuationToken != null){
            this.zytoService.GetAboutPage(this.continuationToken)
            .subscribe(
                response => {
                    let headers = response.headers;
                    this.continuationToken = headers.get('continuation-token');
                    console.log(headers);
                    response = response.json();

                    if (response.length > 0) {
                        response.forEach(element => {
                            this.aboutData.push(element);
                        });
                    }
                    
                    this.globalState.showLoader = false;
                },
                error => { }
            );
        }
    }
    // events
    chartClicked(e: any) {
        console.log(e);
    }

    chartHovered(e: any) {
        console.log(e);
    }

}
