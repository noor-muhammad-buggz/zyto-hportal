import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { JwtHelper, tokenNotExpired, AuthHttp } from "angular2-jwt";
import "rxjs/add/operator/filter";
import * as auth0 from "auth0-js";
import { AnalyticsService } from './analytics.service';
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {

  constructor(private http: Http, private router: Router, private analytics: AnalyticsService) {

    // localStorage.setItem('accountId', 'ea8abb3bd6ed4f688b0e7882a51357f0');
    // localStorage.setItem('eTag', '\"3c007487-0000-0000-0000-598cb0670000\"');
  }

  AddHealthProfessionalTrainingMilestone(milestoneId: any) {
    const accountDetail = JSON.parse(localStorage.getItem('accountDetail'));


    let bodyString = JSON.stringify({});
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      // "If-Match": localStorage.getItem("eTag")
    });
    let options = new RequestOptions({ headers: headers });

    let url = environment.ApiBaseUrl.concat(
      "accounts/{{accountId}}/healthprofessional/training/milestones/{{milestoneId}}"
    );
    url = url.replace("{{accountId}}", localStorage.getItem("accountId"));
    url = url.replace("{{milestoneId}}", milestoneId);

      return this.http
        .post(url, bodyString, options)
        .map((response: Response) => {
          let resp: any;
          resp = response.json();
          localStorage.setItem("eTag", resp.ETag);
          localStorage.setItem("accountDetail", JSON.stringify(resp));
          return resp;
        })
        .catch(this.handleError);


  }

  MarkHealthProfessionalTrainingComplete() {
    let bodyString = JSON.stringify({});
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("eTag")
    });
    let options = new RequestOptions({ headers: headers });

    let url = environment.ApiBaseUrl.concat(
      "accounts/{{accountId}}/healthprofessional/training/markcompleted"
    );
    url = url.replace("{{accountId}}", localStorage.getItem("accountId"));

    return this.http
      .post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("eTag", resp.ETag);
        localStorage.setItem("accountDetail", JSON.stringify(resp));
        return resp;
      })
      .catch(this.handleError);
  }

  handleError(error: any) {
    const err = error.text() ? error.json() : {};
    err.message = error.message || "Server error";
    err.status = error.status;
    // this.analytics.logException(JSON.stringify(error),error.status,{name: error.message}, {name:error.status} ,error.status);
    return Observable.throw(err);
  }
}
