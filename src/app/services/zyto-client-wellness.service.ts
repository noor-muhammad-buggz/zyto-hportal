import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/filter';
import { AnalyticsService } from './analytics.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ZytoClientWellnessService {

  constructor(
    private http: Http,
    private analytics: AnalyticsService,
  ) {
  }

  GetFoundationProgramRun(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/foundationprogramruns/${id}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }
  GetWellnessStatusQuestionnaireResult(id: any) {
    console.log('in GetWellnessStatusQuestionnaires');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/questionnaireresults/${id}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetWellnessStatusQuestionnairesWithDetail(id: any) {
    console.log('in GetWellnessStatusQuestionnaires');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`questionnaires/${id}/withdetails`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('QuestionETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }


  GetWellnessProfileQuestionnaires(id: any, gender: any) {
    console.log('in GetWellnessProfileQuestionnaires');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`wellnessprofilequestionnaires/${id}/withquestionsummaries?gender=${gender}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  saveWellnessProfileQuestionnaires(id: any, body: any, method: any = 'post') {
    console.log('in saveWellnessProfileQuestionnaires');

    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`clientwellnessprofilequestionnaireresults/${id}`);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetSavedWellnessProfileQuestionnaires(client_id: any) {
    console.log('in GetSavedWellnessProfileQuestionnaires');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('eTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`clientwellnessprofilequestionnaireresults/${client_id}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  saveWellnessProfileDraft(clientid: any, data: any, method: any = 'post') {
    console.log('in saveWellnessProfileDraft');

    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`clientwellnessprofilequestionnaireresults/${clientid}/draft`);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        localStorage.setItem('draft-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  ChangeWellnessProfileDraft(clientid: any, data: any) {
    console.log('in ChangeWellnessProfileDraft');

    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('draft-ETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`clientwellnessprofilequestionnaireresults/${clientid}/draft`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        localStorage.setItem('draft-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetWellnessProfileDraft(clientid: any) {
    console.log('in GetWellnessProfileDraft');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('draft-ETag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`clientwellnessprofilequestionnaireresults/${clientid}/draft`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        //localStorage.setItem('eTag', resp.ETag);
        localStorage.setItem('draft-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  RemoveWellnessProfileDraft(clientid: any) {
    console.log('in GetWellnessProfileDraft');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('draft-ETag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`clientwellnessprofilequestionnaireresults/${clientid}/draft`);

    return this.http.delete(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('draft-ETag', (resp) ? resp.ETag : '');
        return resp;
      })
      .catch(this.handleError);

  }

  updateClientWellnesssStatusResultVersion(sessionId, data) {
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      // 'If-Match': localStorage.getItem('session-ETag'),
    });

    const options = new RequestOptions({ headers });
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/clientwellnessstatusquestionnaireresultversion`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  updateClientWellnesssProfileResultVersion(sessionId, data) {
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('session-ETag'),
    });

    const options = new RequestOptions({ headers });
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/clientwellnessprofilequestionnaireresultversion`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }


  AddClientWellnesssResults(clientid, data) {
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('session-ETag'),
    });

    const options = new RequestOptions({ headers });
    const self = this;
    const url = environment.ApiBaseUrl.concat('clientwellnessstatusquestionnaireresults/').concat(clientid);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  ChangeClientWellnesssResults(clientid, data) {
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('session-ETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('clientwellnessstatusquestionnaireresults/').concat(clientid);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // update questionaire results
  UpdateQuestionnaireResults(qId, params) {
    const accountId = localStorage.getItem('accountId');
    const bodyString = JSON.stringify(params);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      // 'if-Match': localStorage.getItem('QuestionETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(accountId).concat('/questionnaireresults/').concat(qId);
    return this.http.patch(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('QuestionETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // update Notes 
  UpdateNotes(pId, fId, params) {
    const accountId = localStorage.getItem('accountId');
    const bodyString = JSON.stringify(params);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      // 'if-Match': localStorage.getItem('QuestionETag'),
    });
    // /api/accounts/{accountId}/foundationprogramruns/{id}/actionplan/foundations/{foundationId}/note
    ///api/accounts/1053ee5bbb0f4ff2b915f5e2c67ebe4e/foundationprogramruns/98715d9edc744b3eaff061939b59f2d7/actionplan/foundations/f9debb6d06e04e12b535057d901335f6/note
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(accountId).concat(`/foundationprogramruns/${pId}/actionplan/foundations/${fId}/note`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('QuestionETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // Mark questionnaire result as completed
  MarkQuestionnaireResultsCompleted(fId, ) {
    const accountId = localStorage.getItem('accountId');
    const bodyString = JSON.stringify('');

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      // 'if-Match': localStorage.getItem('QuestionETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(accountId).concat('/foundationprogramruns/').concat(fId).concat('/statusquestionnairecompleted');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('QuestionETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  

  // Get questionnaire results
  GetClientWellnesssResults(clientid) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': '',
    });
    const accountId = localStorage.getItem('accountId');
    const options = new RequestOptions({ headers });

    const data = {
      "ClientId": clientid,
      "QuestionnaireId": '',
      "QuestionnaireVersion": 1,
      "QuestionResults": null
    };

    const bodyString = JSON.stringify(data);

    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/questionnaireresults`);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetFoundationOverview(foundationId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/foundationprogramruns/${foundationId}/insights/overviewpage`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('ActionPlanEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetFoundationDetail(programId,fid) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    // GET /api/accounts/{accountId}/foundationprogramruns/{id}/insights/foundationpages/{foundationId
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/foundationprogramruns/${programId}/insights/foundationpages/${fid}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('ActionPlanEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }
  

  GetSystemDetail(programId,sid,fid) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    // GET /api/accounts/{accountId}/foundationprogramruns/{id}/insights/systempages/{systemId}
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/foundationprogramruns/${programId}/insights/systempages/${sid}?foundationId=${fid}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('ActionPlanEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // Add to action plan
  AddToActionPlan(fId, type, id, optionId = null) {
    const accountId = localStorage.getItem('accountId');
    // var data = {
    //   "SelectedOptionId": id
    // };
    const bodyString = JSON.stringify(
      {
        "SelectedOptionId": optionId
      }
    );

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('ActionPlanEtag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(accountId).concat('/foundationprogramruns/').concat(fId).concat(`/actionplan/${type}/${id}`);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('ActionPlanEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  RemoveFromActionPlan(fId, type, id) {
    const accountId = localStorage.getItem('accountId');
    // var data = {
    //   "SelectedOptionId": id
    // };
    const bodyString = JSON.stringify({});

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('ActionPlanEtag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(accountId).concat('/foundationprogramruns/').concat(fId).concat(`/actionplan/${type}/${id}`);
    return this.http.delete(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('ActionPlanEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetActionPlanDetail(programId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    // GET /accounts/{{accountId}}/foundationprogramruns/{{foundationProgramRunId}}/actionplanpage
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/foundationprogramruns/${programId}/actionplanpage`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('ActionPlanEtag', resp.ETag);
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
