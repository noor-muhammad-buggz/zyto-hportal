import {ZytoService} from '../services/zyto.service';
import { Injectable, ReflectiveInjector } from '@angular/core';
import {RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivate} from '@angular/router';
import { AnalyticsService } from '../services/analytics.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private authService: AuthService,
      private zytoService: ZytoService,
      private router: Router,
      private analyticsService: AnalyticsService,
    ) { }

    canActivate(
      next:  ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ) {
        console.log('in canActivate');
        console.log('next', next);
        console.log('state', state);
        console.log('this.authService.isAuthenticated()',this.authService.isAuthenticated());

        if (this.authService.isAuthenticated()) {
           localStorage.setItem('scanType','facial');
          console.log('Authenticated..................');
            let accountDetail = JSON.parse(localStorage.getItem('accountDetail'));
            let userProfile = JSON.parse(localStorage.getItem('userProfile'));

            const injector = ReflectiveInjector.resolveAndCreate([AnalyticsService]);
            this.analyticsService = injector.get(AnalyticsService);
            // this.analyticsService.clearAuthenticate();
            this.analyticsService.authenticate(userProfile.user_id, '');

            console.log(userProfile);
            // if(accountDetail && (!accountDetail.License) || (accountDetail && accountDetail.License && !accountDetail.License.Active)){
            //   this.router.navigate(["/pages/unauthorize/nolicenses"]);
            //   return false;
            // }
            if(localStorage.getItem('accountDetail')){
              console.log(accountDetail);
              // (localStorage.getItem('accountDetail') === null) ||
              if(((accountDetail && accountDetail.HealthProfessional == null) || (accountDetail && accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training === null)) || (accountDetail && accountDetail.HealthProfessional && accountDetail.HealthProfessional.Training && accountDetail.HealthProfessional.Training.Completed == null)){
                if(localStorage.getItem('id_token') !== null)
                this.router.navigate(['/introduction']);
              }

              return true;
            }else{
              if(localStorage.getItem("healthProfessionalAccounts")){
                localStorage.setItem('scanType','facial');
                this.router.navigate(["/pages/select-account"]);
              }else{
                this.router.navigate(["/pages/unauthorize/noaccount"]);
                this.router.navigate(["/pages/select-account"]);
              }
            }
        }else{
          localStorage.clear();
          this.authService.login();
        }
        // console.log('unauthenticated navigating to login');
        return false;
    }
}
