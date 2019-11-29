import { Injectable } from '@angular/core';
import { GlobalState } from '../global.state';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JwtHelper, tokenNotExpired, AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/filter';
import { AnalyticsService } from './analytics.service';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';

@Injectable()
export class ZytoScanService {

  constructor(private http: Http,
    public globalState: GlobalState,
    public analytics: AnalyticsService) { }

  GetDeviceId() {
    console.log('in GetDeviceId');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    // headers.append('max-item-count', '10');
    // headers.append('continuation-token', '');

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    let url = environment.ApiBaseUrl.concat('scandevices/?accountid=');
    url = url.concat(localStorage.getItem('accountId'));

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('eTag', resp[resp.length - 1].ETag);
        return resp;
      })
    // .catch(this.handleError);
  }

  GetDeviceById(deviceId: any) {
    // console.log('in GetDevGetDeviceStatusId');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    let url = environment.ApiBaseUrl.concat('scandevices/{{id}}');
    url = url.replace('{{id}}', deviceId);


    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
    // .catch(this.handleError);
  }

  GetDeviceStatus(deviceId: any) {
    // console.log('in GetDevGetDeviceStatusId');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    let url = environment.ApiBaseUrl.concat('scandevices/{{id}}/status');
    url = url.replace('{{id}}', deviceId);


    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  unregisterDevice(deviceId: any) {
    console.log('in unregisterDevice');

    const bodyString = JSON.stringify({});
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('scandevices/').concat(deviceId).concat('/unregisteraccount');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  registerDevice(deviceId: any, name: any) {
    console.log('in registerDevice');
    const data = {
      'AccountId': localStorage.getItem('accountId'),
      'Name': name,
    };
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('scandevices/').concat(deviceId).concat('/registeraccount');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('DeviceETag', resp.ETag);
        return resp;
      })
    // .catch(this.handleError);
  }

  addDevice(deviceId, name) {
    const data = {
      'AccountId': localStorage.getItem('accountId'),
      'Name': name,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('scandevices/').concat(deviceId);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
    // .catch(this.handleError);
  }

  ChangeDeviceName(id, name) {
    const data = {
      'AccountId': localStorage.getItem('accountId'),
      'Name': name,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });
    // const uuid = this.uuid;
    const options = new RequestOptions({ headers });
    let url = environment.ApiBaseUrl.concat('scandevices/{{id}}/name');
    url = url.replace('{{id}}', id);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  SetupAddOrChange(id, values) {
    const data = {
      'State': 'WaitingForBiosurvey',
      'ContactStates': [
        values.r1, values.r2, values.r3, values.r4, values.r5,
      ],
      'Calibrated': values.r7,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    // const uuid = this.uuid;
    const options = new RequestOptions({ headers });
    let url = environment.ApiBaseUrl.concat('scandevices/{{id}}/status');
    url = url.replace('{{id}}', id);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  GetAllDevices() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    headers.append('max-item-count', '5');
    headers.append('continuation-token', '');

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat('scandevices?accountid=').concat(localStorage.getItem('accountId'));

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetSessionWithId(sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId').concat('/foundationprogramruns/')
        .concat(sessionId));

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }
  ///api/accounts/{accountId}/sessions/{id}/startbiosurveyrun
  StartBioSurevey(scanId, BiosurveyRunId) {

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      // 'If-Match': localStorage.getItem('session-ETag'),
    });
    // const uuid = this.uuid;
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('scandevices/').concat(scanId).concat('/biosurveyrunid');
    const data = {
      'BiosurveyRunId': BiosurveyRunId,
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  // Get bioSurvey Run
  GetBiosurveyRunById(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    var accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/biosurveyruns/${id}`);

    return this.http.get(url, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  
  // GGet Facial Recognition
  GetFacialRecognitionById(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    var accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/facialrecognitionscans//${id}`);

    return this.http.get(url, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  // Faical Scan api's

  createFacialRecognition(ClientId) {

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('AccounteTag'),
    });
    // const uuid = this.uuid;
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId')).concat('/facialrecognitionscans');
    const data = {
      'ClientId': ClientId,
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('facialEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  FindFaceInImage(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      // 'If-Match': localStorage.getItem('facialEtag'),
    });
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId')).concat(`/facialrecognitionscans/${id}/findface`);

    // alert(scanId);
    const data = {
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('facialEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  FaceVerified(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      // 'If-Match': localStorage.getItem('facialEtag'),
    });
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId')).concat(`/facialrecognitionscans/${id}/face/verified`);

    // alert(scanId);
    const data = {
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('facialEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  FaceVerificationFailed(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      // 'If-Match': localStorage.getItem('facialEtag'),
    });
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId')).concat(`/facialrecognitionscans/${id}/face/failedverification`);

    // alert(scanId);
    const data = {
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('facialEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  ChangeClickTimestamps(id,body) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      // 'If-Match': localStorage.getItem('facialEtag'),
    });
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId')).concat(`/facialrecognitionscans/${id}/clicktimestamps`);

    // alert(scanId);
    const data = {
      "ClickTimestamps": body
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('facialEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  StartRunWithClientSignature(id,body) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      // 'If-Match': localStorage.getItem('facialEtag'),
    });
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId')).concat(`/biosurveyruns/${id}/startrunwithclientsignature`);

    // alert(scanId);
    const data = {
      "ClientSignature": body
    };
    // alert(scanId);
    const bodyString = JSON.stringify(data);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        // localStorage.setItem('facialEtag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }



  GetBiosurveyRunImportRuns(accountId, sessionId, biosurveyRunId, id) {
    this.globalState.showLoader = true;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    // GET /api/accounts/{accountId}/sessions/{sessionId}/biosurveyruns/{biosurveyRunResultId}/result/runs/{id}
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/biosurveyruns/${biosurveyRunId}/result/runs/${id}`);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  CreateBiosurveyRunImportRuns(accountId, sessionId, biosurveyRunId) {
    this.globalState.showLoader = true;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const data = {
      "Enqueue": true
    };
    // GET /api/accounts/{accountId}/sessions/{sessionId}/biosurveyruns/{biosurveyRunResultId}/result/runs/{id}
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/biosurveyruns/${biosurveyRunId}/result/runs`);
    const bodyString = JSON.stringify(data);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetBiosurveyActionPlan(biosurveyRunId, SessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId').concat(`/sessions/${SessionId}`)
        .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/withdetails`));
    // const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/biosurveyruns/${biosurveyRunId}/actionplan/withdetails`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // Wellness zone Api's
  AddUpdateZone(biosurveyRunId, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const zoneid = data.zoneId;
    const type = data.type;
    const method = data.method;
    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/sessions/${sessionId}`)
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/zones/${type}.${zoneid}`);
    // console.log(url);
    const data1 = {
      'Note': data.Note,
    };
    const bodyString = JSON.stringify(data1);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  // End wellness Zone Api's

  // Start Supplement (Distributor Api's)
  GetSupplementById(Id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`distributors/BR/distributorproducts/${Id}`);

    return this.http.get(url, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  AddUpdateSupplement(biosurveyRunId, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const suppleid = data.suppleid;
    const method = data.method;
    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/sessions/${sessionId}`)
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/distributorproducts/${suppleid}`);
    // console.log(url);
    const data1 = {
      'Note': data.Note,
      'SelectedOptionDistributorProductId': (data.SelectedOptionDistributorProductId !== '') ? data.SelectedOptionDistributorProductId : suppleid,
      'Quantity': data.Quantity,
    };
    // console.log(data1); return data1;
    const bodyString = JSON.stringify(data1);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  // End Supplement (Distributor Api's)

  // Wellness Food Api's
  AddUpdateFood(biosurveyRunId, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const foodid = data.foodId;
    const method = data.method;
    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/sessions/${sessionId}`)
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/foods/${foodid}`);
    // console.log(url);
    const data1 = {
      'Note': data.Note,
    };
    const bodyString = JSON.stringify(data1);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  // End wellness foods Api's

  // Wellness services Api's
  AddUpdateService(biosurveyRunId, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const servicesid = data.servicesId;
    const method = data.method;
    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/sessions/${sessionId}`)
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/services/${servicesid}`);
    // console.log(url);
    const data1 = {
      'Note': data.Note,
    };
    const bodyString = JSON.stringify(data1);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  // End wellness Services Api's

  // Goal Api's
  AddGoal(biosurveyRunId, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    let goalId = '';
    if (data.goalId) {
      goalId = '/' + data.goalId;
    }

    const method = data.method;
    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/sessions/${sessionId}`).concat(`/biosurveyruns/${biosurveyRunId}/actionplan/goals${goalId}`);
    // console.log(url);
    const data1 = {
      'Name': data.Name,
      'Note': data.Note,
    };
    const bodyString = JSON.stringify(data1);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  //End Goal Api's

  savePlan(biosurveyRunId, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const servicesid = data.planId;
    const method = data.method;
    const type = data.type;
    console.log(type);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/sessions/${sessionId}`)
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/${type}/${servicesid}`);
    // console.log(url);
    const data1 = {
      'Note': data.Note,
    };
    const bodyString = JSON.stringify(data1);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  moveTabs(biosurveyRunId, target, Id, data, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('AccounteTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId').concat(`/sessions/${sessionId}`))
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/${target}/${Id}/move`);
    const data1 = {
      'Index': data,
    };
    const bodyString = JSON.stringify(data1);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  removeTabs(biosurveyRunId, target, Id, sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId').concat(`/sessions/${sessionId}`))
      .concat(`/biosurveyruns/${biosurveyRunId}/actionplan/${target}/${Id}`);

    return this.http.delete(url, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  GetContradiction(bioserveyrunId, sessionId) {
    console.log('in GetWellnessProfileQuestionnaires');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const accountId = localStorage.getItem('accountId');
    // const sessionId = localStorage.getItem('currentSessionId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/biosurveyruns/${bioserveyrunId}/contraindications`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('contraindiction-eTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  saveContradiction(bioserveyrunId: any, body: any, method: any = 'put', sessionId) {
    console.log('in bioserveyrunId');
    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      "If-Match": localStorage.getItem("contraindiction-eTag")
    });
    const options = new RequestOptions({ headers });

    const accountId = localStorage.getItem('accountId');
    // const sessionId = localStorage.getItem('currentSessionId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/sessions/${sessionId}/biosurveyruns/${bioserveyrunId}/contraindications/questionresults`);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  // Appointment
  GetAppointment(appointmentId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/appointments/${appointmentId}`);
    // console.log(url);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AppointmenteTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  AddAppointment(data) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('AppointmenteTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/appointments`);
    // console.log(url);
    const data1 = {
      'ClientId': data.ClientId,
      'Date': data.Date,
      'SourceSessionId': data.SourceSessionId
    };
    const bodyString = JSON.stringify(data1);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  updateAppointment(data, appointmentId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('AppointmenteTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/appointments/${appointmentId}/date`);
    // console.log(url);
    const data1 = {
      'Date': data.Date,
    };
    const bodyString = JSON.stringify(data1);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  removeAppointment(appointmentId) {
    const headers = new Headers({
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/appointments/${appointmentId}`);
    // console.log(url);

    return this.http.delete(url, options)
      .map((response: Response) => response)
      .catch(this.handleError1);
  }

  // Virtual Items
  GetVirtualItemsById(id) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`api/virtualitems/${id}`);
    // console.log(url);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AppointmenteTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetAllVirtual(collectionIds = '', count = '', continuationToken = '') {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });
    headers.append('max-item-count', count);
    headers.append('continuation-token', continuationToken);

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat(`/virtualitems?archived=false&collectionids=${collectionIds}`);
    // console.log(url);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response;
        return resp;
      }).catch(this.handleError);
  }

  AddVirtualItems(id, data) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('AppointmenteTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/appointments`);
    // console.log(url);
    const data1 = {
      'ClientId': data.ClientId,
      'Date': data.Date,
      'SourceSessionId': data.SourceSessionId
    };
    const bodyString = JSON.stringify(data1);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  updateVirtualItems(id, data) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('AppointmenteTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/virtualitems/${id}/date`);
    // console.log(url);
    const data1 = {
      'Date': data.Date,
    };
    const bodyString = JSON.stringify(data1);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  removeVirtualItems(appointmentId) {
    const headers = new Headers({
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    // console.log(zoneid);
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/appointments/${appointmentId}`);
    // console.log(url);

    return this.http.delete(url, options)
      .map((response: Response) => response)
      .catch(this.handleError1);
  }

  handleError(error: any) {
    const err = error.text() ? error.json() : {};
    err.message = error.json().message || 'Server error';
    err.status = error.json().status;
    // this.analytics.logException(err,err.status,{name: err.message}, {name:err.status} ,err.status);
    // this.globalState.showMessage('error',err.message,err.status);
    return Observable.throw(err);
  }

  handleError1(error: any) {
    // console.log(error);
    if (error != '') {
      const err = error.text() ? error.json() : {};
      err.message = error.json().message || 'Server error';
      err.status = error.json().status;
      // this.analytics.logException(err,err.status,{name: err.message}, {name:err.status} ,err.status);
      // this.globalState.showMessage('error',err.message,err.status);
      return Observable.throw(err);
    } else {
      return error;
    }
  }

}
