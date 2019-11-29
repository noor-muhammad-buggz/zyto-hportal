import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { GlobalState } from '../global.state';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar *ngIf="globalState.showSidebar"></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="" [ngClass]="{'al-main':globalState.showSidebar === true,'al-main-with-nosideabr':globalState.showSidebar === false}">
    <div class="a_main_bg" [ngClass]="{'a_home_bg':globalState.currentPage == 'dashboard1'}"></div>
    <div *ngIf="!globalState.showSidebar" class="a_checkout_left_bg"></div>
      <div class="al-content">
        <ba-content-top [ngClass]="{'a_checkout_page':!globalState.showSidebar}"></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
     <!-- <footer class="al-footer clearfix">
      <div class="al-footer-right" translate></div>
      <div class="al-footer-main clearfix">
        <p class="a_copyright">© 2017 <a href="javascript:;" translate>{{'general.title'}}</a> Corp. All Rights Reserved | <a href="javascript:;">Privacy Policy</a></p>
      </div>
    </footer> -->
    <footer class="a_p_footer">
    <div class="container">
        <p class="text-center">&copy; 2017 <a href="javascript:;">ZYTO</a> Corp. All Rights Reserved | <a href="javascript:;">Privacy Policy</a> | <a href="javascript:;">Terms and Conditions</a></p>
    </div>
</footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {

  constructor(private _menuService: BaMenuService, public globalState: GlobalState) {
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
