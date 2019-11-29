import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AnalyticsService } from './analytics.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ZytoService {
  title = 'Api testing';
  data: any = {};

  constructor(private http: Http, public router: Router, private analytics: AnalyticsService) {
  }

  GetUserById() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    const url = environment.ApiBaseUrl.concat('users/')
      .concat(profile.sub);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }


  GetAccountId() {
    console.log('in GetAccountId');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    headers.append('max-item-count', '5');
    headers.append('continuation-token', '');

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    let url = environment.ApiBaseUrl.concat(`accounts?healthprofessionalUserId=`);
    if (profile && profile.sub) {
      console.log('profile.sub condition');
      url = url.concat(profile.sub);
    }

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetAccountById() {
    console.log('in GetAccountById');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    let url = environment.ApiBaseUrl.concat(`accounts/${localStorage.getItem('accountId')}`);
    // if (profile && profile.sub) {
    //   console.log('profile.sub condition');
    //   url = url.concat(profile.sub);
    // }

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }





  CreateClient(values) {
    const data = {
      'PersonInfo': {
        'Name': {
          'Prefix': null,
          'FirstName': values.firstname,
          'MiddleName': values.middlename,
          'LastName': values.lastname,
        },
        'Gender': values.gender,
        'DateOfBirth': values.birthday,
      },
      'ContactInfo': {
        'Email': values.email,
        'Phone': values.phone,
        'Preference': {
          'Email': (values.preffered == 'Email') ? true : false,
          'Text': (values.preffered == 'Text') ? true : false,
        },
        'DefaultShippingAddress': {
          'Line1': values.line1,
          'Line2': values.line2,
          'City': values.city,
          'Province': values.province,
          'PostalCode': values.postalCode,
          'Country': values.country,
        },
      },
      'ReferredBy': values.refferedby,
    };

    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('clients');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  ChangeClientPersonal(id, values) {
    const data = {
      'PersonInfo': {
        'Name': {
          'Prefix': null,
          'FirstName': values.firstname,
          'MiddleName': values.middlename,
          'LastName': values.lastname,
        },
        'Gender': values.gender,
        'DateOfBirth': values.birthday,
      },
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('client_ETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('clients/').concat(id).concat('/personinfo');
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  ChangeClientContact(id, values) {
    console.log(values.preffered);
    const data = {
      'ContactInfo': {
        'Email': values.email,
        'Phone': values.phone,
        'Preference': {
          'Email': (values.preffered == 'Email') ? true : false,
          'Text': (values.preffered == 'Text') ? true : false,
        },
        'DefaultShippingAddress': {
          'Line1': values.line1,
          'Line2': values.line2,
          'City': values.city,
          'Province': values.province,
          'PostalCode': values.postalCode,
          'Country': values.country,
        },
      },
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('client_ETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('clients/').concat(id).concat('/contactinfo');
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  ChangeClientRefferedBy(id, values) {
    const data = {
      'ReferredBy': values.refferedby,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('client_ETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('clients/').concat(id).concat('/referredby');
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  ChangeClientUpdate(id, values) {
    const data = {
      "ChangeContactInfoRequest": {
        'ContactInfo': {
          'Email': values.email,
          'Phone': values.phone,
          'Preference': {
            'Email': (values.preffered == 'Email') ? true : false,
            'Text': (values.preffered == 'Text') ? true : false,
          },
          'DefaultShippingAddress': {
            'Line1': values.line1,
            'Line2': values.line2,
            'City': values.city,
            'Province': values.province,
            'PostalCode': values.postalCode,
            'Country': values.country,
          },
        },
      },
      "ChangePersonInfoRequest": {
        'PersonInfo': {
          'Name': {
            'Prefix': null,
            'FirstName': values.firstname,
            'MiddleName': values.middlename,
            'LastName': values.lastname,
          },
          'Gender': values.gender,
          'DateOfBirth': values.birthday,
        },
      },
      "ChangeReferredByRequest": {
        'ReferredBy': values.refferedby,
      }
    };

    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('client_ETag'),
    });
    // POST /api/clients/{id}/bulkchange
    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('clients/').concat(id).concat('/bulkchange');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  AssociateClient(clientid) {
    const data = {
      'AccountId': localStorage.getItem('accountId'),
      'ClientId': clientid,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accountclientassociations');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  GetClientAssociation(clientId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    const options = new RequestOptions({ headers });

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accountclientassociations/${accountId}..${clientId}`);
    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('client-association-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  ArchiveClient(clientId, archived = true) {
    const data = {
      'Archived': archived,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('client-association-ETag'),
    });
    const options = new RequestOptions({ headers });

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accountclientassociations/${accountId}..${clientId}/archived`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('client-association-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetClientById(clientid) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('clients/')
      .concat(clientid).concat('/withactiveaccountprogramruns?accountId=').concat(accountId);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json() || { message: 'Server error' })).toPromise();
  }

  GetClientByIdTemp(clientid) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('clients/')
      .concat(clientid).concat('/withactiveaccountprogramruns?accountId=').concat(accountId);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json() || { message: 'Server error' }));
  }

  GetAllClients(searchtext = '', archive = 'false') {
    let queryString = '';
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    //headers.append('max-item-count', '5');
    headers.append('continuation-token', '');

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    if (searchtext !== '') {
      queryString += `&searchtext=${searchtext}`;
    }

    if (archive !== null) {
      queryString += `&archived=${archive}`;
    }

    const profile = JSON.parse(localStorage.getItem('userProfile'));
    const url = environment.ApiBaseUrl.concat('clients?accountid=').concat(localStorage.getItem('accountId'))
      .concat(queryString);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetAllClientsWithSessionDetail(searchtext = '', archive = 'false') {
    let queryString = '';
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    //headers.append('max-item-count', '5');
    headers.append('continuation-token', '');

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    if (searchtext !== '') {
      queryString += `&searchtext=${searchtext}`;
    }

    if (archive !== null) {
      queryString += `&archived=${archive}`;
    }
    // GET /api/clients/withactiveaccountprogramruns
    const url = environment.ApiBaseUrl.concat('clients/withactiveaccountprogramruns?accountid=').concat(localStorage.getItem('accountId'))
      .concat(queryString);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetSessionById(sessionId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    headers.append('max-item-count', '5');
    headers.append('continuation-token', '');

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId'))
      .concat('/programruns/').concat(sessionId);
    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetAllSessionWithClientId(clientId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`clients/${clientId}/programruns`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', (resp && resp[0]) ? resp[0].ETag : '');
        return resp;
      })
      .catch(this.handleError);
  }

  GetAllCompletedSessionWithClientId(clientId, maxCount = '', continuation = '') {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    headers.append('max-item-count', maxCount);
    headers.append('continuation-token', continuation);


    const options = new RequestOptions({ headers });

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/programruns?ClientId=${clientId}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response;
        // localStorage.setItem('session-ETag', (resp && resp[0]) ? resp[0].ETag : '');
        return resp;
      })
      .catch(this.handleError);
  }

  CreateSession(clientid) {
    const data = {
      'ClientId': clientid,
      'ProgramId': 'foundation',
    };
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId'))
      .concat('/programruns');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  CreateQuestionnaireResult(clientid, qid) {
    const data = {
      'ClientId': clientid,
      'QuestionnaireId': qid,
      'QuestionnaireVersion': 1,
      'QuestionResults': null
    };
    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('accounts/').concat(localStorage.getItem('accountId'))
      .concat('/questionnaireresults');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('session-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }


  GetCountryStates(countryID = 'US') {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`countries/${countryID}/subdivisions`);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetClientTermAndConditions() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat('termsandconditionsagreements/cache/client');

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  saveClientTermAndConditions(clientid, currentVersion) {
    const bodyString = JSON.stringify({});
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`clients/${clientid}/termsandconditions/agreements/${currentVersion}`);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  emailClientTermAndConditions(clientid) {
    const bodyString = JSON.stringify({});
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`clients/${clientid}/emailtermsandconditions`);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  GetClientNotes(clientId: any) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/accountclientnotes/${clientId}`);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  saveClientNotes(clientId: any, body: any, method: any = 'post') {
    console.log('in saveClientNotes');

    const bodyString = JSON.stringify(body);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    const options = new RequestOptions({ headers });

    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/accountclientnotes/${clientId}`);
    return this.http[method](url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  // create new card
  CreateAccountCard(accountID, token) {
    const params = {
      'StripeToken': token
    };
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("AccounteTag")
    });

    const options = new RequestOptions({
      headers
    });
    const url = environment.ApiBaseUrl.concat(
      `accounts/${accountID}/license/subscription/creditcards`
    );

    const bodyString = JSON.stringify(params);
    console.log('PARAMS ARE : ', bodyString);
    return this.http
      .post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // remove account credit card
  RemoveExistingAccountCard(accountID, card) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      // "If-Match": localStorage.getItem("AccounteTag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `accounts/${accountID}/license/subscription/creditcards/${card}`
    );
    return this.http
      .delete(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // save existing card as default
  SaveExistingAccountCard(accountID, card) {
    const body = JSON.stringify({});
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("AccounteTag")
    });

    const options = new RequestOptions({
      headers
    });
    const url = environment.ApiBaseUrl.concat(
      `accounts/${accountID}/license/subscription/creditcards/${card}/default`
    );

    return this.http
      .post(url, body, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  // save existing card as default
  reactivateSubscription() {
    const body = JSON.stringify({});
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("AccounteTag")
    });

    const options = new RequestOptions({
      headers
    });
    const accountId = localStorage.getItem('accountId');
    // POST /api/accounts/{id}/license/subscription/reactivate
    const url = environment.ApiBaseUrl.concat(
      `accounts/${accountId}/license/subscription/reactivate`
    );

    return this.http
      .post(url, body, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  GetAccountDetailById(accountId) {
    console.log('in GetAccountById');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    let url = environment.ApiBaseUrl.concat(`accounts/`);
    console.dir('profile.sub condition');
    //const accountId = localStorage.getItem('accountId');
    url = url.concat(accountId);


    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        localStorage.setItem("accountDetail", JSON.stringify(resp));
        return resp;
      })
      .catch(this.handleError);
  }
  // get software products with details
  GetSoftwareProductsWithDetails() {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("AccounteTag")
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(
      `softwareproducts/base/withdetails`
    );

    return this.http
      .get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        return resp;
      })
      .catch(this.handleError);
  }

  // upgrade subscription
  UpgradeAccountSubscription(accountID, token) {
    const params = {
      'StripeToken': token
    };
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("id_token"),
      "If-Match": localStorage.getItem("AccounteTag")
    });

    const options = new RequestOptions({
      headers
    });
    const url = environment.ApiBaseUrl.concat(
      `accounts/${accountID}/license/subscription`
    );

    const bodyString = JSON.stringify(params);
    return this.http
      .post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  changeAccountName(values) {
    const data = {
      'Name': values.name,
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'if-Match': localStorage.getItem('AccounteTag'),
    });

    const options = new RequestOptions({ headers });
    const id = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('accounts/').concat(id).concat('/name');
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        localStorage.setItem("accountDetail", JSON.stringify(resp));
        return resp;
      })
      .catch(this.handleError);

  }

  ChangeAccountContactInfo(values) {
    const data = {
      'ContactInfo': {
        'Email': values.email,
        'Phone': values.phone,
        'PersonName': {
          'Prefix': (values.prefix) ? values.prefix : false,
          'FirstName': (values.firstname) ? values.firstname : false,
          'MiddleName': (values.middlename) ? values.middlename : false,
          'LastName': (values.lastname) ? values.lastname : false,
        },
        'Address': {
          'Line1': values.line1,
          'Line2': values.line2,
          'City': values.city,
          'Province': values.province,
          'PostalCode': values.postalcode,
          'Country': values.country,
        },
      },
    };
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'if-Match': localStorage.getItem('AccounteTag'),
    });

    const options = new RequestOptions({ headers });
    const id = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('accounts/').concat(id).concat('/contactinfo');
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        localStorage.setItem("accountDetail", JSON.stringify(resp));
        return resp;
      })
      .catch(this.handleError);

  }

  ChangeBulkAccount(values) {
    const data = {
      'ChangeContactInfoRequest': {
        'ContactInfo': {
          'Email': values.email,
          'Phone': values.phone,
          'PersonName': {
            'Prefix': (values.prefix) ? values.prefix : false,
            'FirstName': (values.firstname) ? values.firstname : false,
            'MiddleName': (values.middlename) ? values.middlename : false,
            'LastName': (values.lastname) ? values.lastname : false,
          },
          'Address': {
            'Line1': values.line1,
            'Line2': values.line2,
            'City': values.city,
            'Province': values.province,
            'PostalCode': values.postalcode,
            'Country': values.country,
          },
        },
      },
      'ChangeNameRequest': {
        'Name': values.name,
      }
    };
    const bodyString = JSON.stringify(data);
    // POST /api/accounts/{id}/bulkchange
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'if-Match': localStorage.getItem('AccounteTag'),
    });

    const options = new RequestOptions({ headers });
    const id = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('accounts/').concat(id).concat('/bulkchange');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        localStorage.setItem("accountDetail", JSON.stringify(resp));
        return resp;
      })
      .catch(this.handleError);

  }

  GetAllservices() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(`services?archived=false`);

    return this.http.get(url, options)
      .map((response: Response) => response.json()) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetservicesByAccountId() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  ChangeServiceId(data) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('AccounteTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const bodyString = JSON.stringify(data);
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/serviceids`);

    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetAccountLicense() {
    console.log('GetAccountLicense');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetAccountDetail() {
    console.log('GetAccountDetail');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`accounts/${accountId}/withdetails`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.Account.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetCustomerByCustomerId(customerId, cache = false) {
    console.log('in GetCustomerByCustomerId');
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    let url = (cache) ? environment.ApiBaseUrl.concat(`customers/cache/${customerId}`) : environment.ApiBaseUrl.concat(`customers/${customerId}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('customer-ETag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }


  ChangeCustomerDetail(customerId, data) {
    const bodyString = JSON.stringify(data);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('customer-ETag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`customers/${customerId}/contactinfo`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  ChangeCreditCard(data, customerId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('customer-ETag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const bodyString = JSON.stringify(data);
    const url = environment.ApiBaseUrl.concat(`customers/${customerId}/creditcards`);

    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('customer-ETag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  ChangeCustomer(data, customerId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'if-Match': localStorage.getItem('customer-ETag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const accountId = localStorage.getItem('accountId');
    const bodyString = JSON.stringify(data);
    const url = environment.ApiBaseUrl.concat(`customers/${customerId}/contactinfo`);

    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('customer-ETag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetAccountRep(administratorId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const accountId = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat(`administrators/${administratorId}/withdetails`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('AccounteTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetAllsalesorders(clientId, max, token) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    headers.append('max-item-count', max);
    headers.append('continuation-token', token);

    const accountId = localStorage.getItem('accountId');
    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(`salesorders?accountId=${accountId}&clientId=${clientId}`);

    return this.http.get(url, options)
      .map((response: Response) => response) // ...and calling .json() on the response to return data
      .catch(this.handleError);
  }

  GetSalesrdersById(salesOrderId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    const accountId = localStorage.getItem('accountId');
    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(`salesorders/${salesOrderId}`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('SalesOrdereTag', resp.ETag);
        return resp;
      }).catch(this.handleError);
  }

  GetSalesrdersByIdWithDetail(salesOrderId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
    });
    const accountId = localStorage.getItem('accountId');
    const options = new RequestOptions({
      headers,
    }); // Create a request option
    const url = environment.ApiBaseUrl.concat(`salesorders/${salesOrderId}/withdetails`);

    return this.http.get(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('SalesOrdereTag', resp.ETag || resp.SalesOrder && resp.SalesOrder.ETag);
        return resp;
      }).catch(this.handleError);
  }

  // Prepare sales order
  PrepareSalesOrder(programId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('ActionPlanEtag'),
    });
    console.log('Preapre sales order')

    const options = new RequestOptions({
      headers,
    }); // Create a request option
    // POST /api/accounts/{accountId}/foundationprogramruns/{id}/actionplan/preparesaleorder
    const url = environment.ApiBaseUrl.concat('accounts/')
      .concat(localStorage.getItem('accountId')).concat(`/foundationprogramruns/${programId}/actionplan/preparesaleorder`);
    // console.log(url);

    const bodyString = JSON.stringify('');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('SalesOrdereTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }
  // Change line items
  changeLineItems(salesOrderId, data) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'If-Match': localStorage.getItem('SalesOrdereTag'),
    });

    const options = new RequestOptions({
      headers,
    }); // Create a request option

    const url = environment.ApiBaseUrl.concat(`salesorders/${salesOrderId}/lineitems`);


    console.log(data);

    const bodyString = JSON.stringify(data);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  changeShippingTo(salesOrderId: any, data: any) {
    console.log('in changeShippingTo');

    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('SalesOrdereTag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`salesorders/${salesOrderId}/shipto`);
    return this.http.put(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('SalesOrdereTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  SaleOrderPayment(salesOrderId: any, data: any) {
    console.log('in SaleOrderPayment');

    const bodyString = JSON.stringify(data);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      'If-Match': localStorage.getItem('SalesOrdereTag'),
    });

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat(`salesorders/${salesOrderId}/pay`);
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem('SalesOrdereTag', resp.ETag);
        return resp;
      })
      .catch(this.handleError);
  }

  uploadImage(values) {
    // const data = {
    //   'Name': values.Image,
    // };
    const bodyString = JSON.stringify(values.Image);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
      'if-Match': localStorage.getItem('AccounteTag'),
    });

    const options = new RequestOptions({ headers });
    const id = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('accounts/').concat(id).concat('/image/upload');
    return this.http.post(url, bodyString, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  deleteImage() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '.concat(localStorage.getItem('id_token')),
    });

    const options = new RequestOptions({ headers });
    const id = localStorage.getItem('accountId');
    const url = environment.ApiBaseUrl.concat('accounts/').concat(id).concat('/image');
    return this.http.delete(url, options)
      .map((response: Response) => {
        let resp: any;
        resp = response.json();
        localStorage.setItem("AccounteTag", resp.ETag);
        return resp;
      })
      .catch(this.handleError);

  }

  GetAboutPage(token = '') {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    });
    headers.append('max-item-count', '10');
    headers.append('continuation-token', token);

    const options = new RequestOptions({ headers });
    const url = environment.ApiBaseUrl.concat('applications/HealthProfessionalPortal/applicationversions?archived=false&published=true');
    return this.http.get(url, options)
      .map((response: Response) => response)
      .catch(this.handleError);

  }

  handleError(error: any) {
    const err = error.text() ? error.json() : {};
    err.message = error.message || "Server error";
    err.status = error.status;
    // console.log(error);
    // this.analytics.logException(JSON.stringify(err),err.status,{name: err.message}, {name:err.status} ,err.status);
    return Observable.throw(err);
  }

}
