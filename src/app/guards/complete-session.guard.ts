import {ZytoService} from '../services/zyto.service';
import { Injectable } from '@angular/core';
import {RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivate} from '@angular/router';
import { GlobalState } from '../global.state';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CompleteSessionGuard implements CanActivate {

    constructor(
      private authService: AuthService,
      private zytoService: ZytoService,
      private router: Router,
      public globalState: GlobalState,
    ) { }

    canActivate(
      next:  ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ) {
        // this.globalState.showLoader = true;
        console.log('in canActivate');
        console.log('CompleteSessionGuard');
        console.log('next', next.params.sid);
        console.log('state', state);
        console.log('this.authService.isAuthenticated()',this.authService.isAuthenticated());

        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionClientId');
        localStorage.removeItem(`currentSession`);
        localStorage.removeItem(`existingSessionStarted`);
        // localStorage.removeItem(`currentSessionClient`);

        this.zytoService.GetSessionById(next.params.sid).subscribe(x=>{
          console.log('Session-status',x);
          if(x && !x.InsightsAndActionsReady){
            this.globalState.showMessage('error','This session is not ready for Insights And Actions','Session not Completed');
            setTimeout(() => {
              this.router.navigate(['/pages/clients']);
            }, 250);
            return false;
          }
        },error => {
            this.globalState.showMessage('error','This session is Invalid','Invalid Session');
            setTimeout(() => {
              this.router.navigate(['/pages/clients']);
            }, 250);
            
            return false;
        });
        // console.log('unauthenticated navigating to login');
        return true;
    }
}
