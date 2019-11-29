import { ZytoScanService } from '../services/zyto-scan.service';
import { Injectable, Component } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ZytoClientWellnessService } from '../services/zyto-client-wellness.service';

import * as _ from 'lodash';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class SessionCancelGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private zytoClientWellnessService: ZytoClientWellnessService,
    private zytoScanService: ZytoScanService,
  ) { }

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ) {
    const self = this;
    // Get the current URL
    console.log(nextState.url);
    console.log('component', component);

    if (localStorage.getItem('currentSessionId')) {
      const regexWellnessProfile = /(wellness-profile)$/i;
      const regexScanPage = /(scan)$/i;
      const regexAllSessionPages = /(wellness-status)|(wellness-profile)|(scan)$/i;
      console.log(`regex matrched = ${regexAllSessionPages.test(nextState.url)}`);

      if (regexAllSessionPages.test(nextState.url)) {
        return true;
      } else {
        const result = confirm('Are you sure you want to leave current Session?');

        if (result && regexWellnessProfile.test(currentState.url)) {
          const val = component.valForm.value;
          val.QuestionResults = _.flatten(val.QuestionResults);
          this.zytoClientWellnessService.GetWellnessProfileDraft(component.clientId).subscribe(response => {
            this.zytoClientWellnessService.saveWellnessProfileDraft(component.clientId, val, 'put').subscribe(response1 => {
              console.log(response1);
            });
          }, error => {
            self.zytoClientWellnessService.saveWellnessProfileDraft(component.clientId, val).subscribe(response => {
            });
          });
          //return result;
        } else if (result && regexScanPage.test(currentState.url)) {
        //   this.zytoScanService.PauseBioSurevey(component.scanId).subscribe(response => {

        //   });
        } else {
          //return result;
        }

        if (result) {
          localStorage.removeItem('currentSessionId');
          localStorage.removeItem('currentSessionClientId');
          localStorage.removeItem(`currentSession`);
          localStorage.removeItem(`existingSessionStarted`);
          localStorage.removeItem(`session-ETag`);
          localStorage.removeItem(`currentSessionClient`);
        }

        return result;
      }
    } else {
      return true;
    }

  }

}
