import {Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppInsights } from 'applicationinsights-js';
import { Observable } from 'rxjs';

@Injectable()
export class AnalyticsService {

  private config: Microsoft.ApplicationInsights.IConfig = {
    instrumentationKey: environment.appInsights.instrumentationKey
  };

  constructor() {
    if (!AppInsights.config) {
      AppInsights.downloadAndSetup(this.config);
    }
  }

  logPageView(name?: string, url?: string, properties?: any,
    measurements?: any, duration?: number) {
    const accountId = localStorage.getItem('accountId'); //user_id
    const userprofile = JSON.parse(localStorage.getItem('userProfile'));
    console.log('Environment',environment.appInsights.instrumentationKey);
    console.log(userprofile);
    let str:any = '';
    if(userprofile && userprofile.user_id && !accountId){
      AppInsights.setAuthenticatedUserContext(userprofile.user_id);
      str = {['user_Id']:  userprofile.user_id};
    } else if(!userprofile && accountId){
      AppInsights.setAuthenticatedUserContext('',accountId);
      str = {['user_AccountId']:  accountId};
    } else if(userprofile && userprofile.user_id && accountId){
      AppInsights.setAuthenticatedUserContext(userprofile.user_id,accountId);
      str = {['user_Id']:  userprofile.user_id,['user_AccountId']:  accountId};
    }
    AppInsights.trackPageView(name, url, str, measurements, duration);
    // AppInsights.trackException(); 
  }
  authenticate(uid,aid){
    AppInsights.setAuthenticatedUserContext(uid,aid,true);
  }

  clearAuthenticate(){
    AppInsights.clearAuthenticatedUserContext();
  }

  logException(exception,handleAt,properties,measurements,secureityLevel){
    console.log('Track Exception');
    // alert('asdas');
    AppInsights.trackException(exception,handleAt,properties,measurements,secureityLevel);
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    AppInsights.trackEvent(name, properties, measurements);
  }

} 
