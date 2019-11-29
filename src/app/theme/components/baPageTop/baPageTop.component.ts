import { Component, OnInit, style, animate, state, transition, trigger } from '@angular/core';

import { GlobalState } from '../../../global.state';
import { AuthService } from '../../../services/auth.service';

import { environment } from '../../../../environments/environment';
import { NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'ba-page-top',
	templateUrl: './baPageTop.html',
	styleUrls: ['./baPageTop.scss'],
	//   animations: [
	//     trigger('visibleTrigger', [
	//         state('visible', style({ opacity: '1' })),
	//         transition('void => *', [style({ opacity: '0' }), animate('200ms 300ms')]),
	//         transition('* => void', [animate('200ms', style({ opacity: '0' }))]),
	//     ]),
	// ],
})
export class BaPageTop implements OnInit {

	public isScrolled: boolean = false;
	public isMenuCollapsed: boolean = false;

	profile: any;
	isTrainingPage: boolean = false;
	isNoSidebarPage: boolean = false;
	isSearchVisible: boolean = false;
	searchString: string;
	isAlreadyTrainingCompleted: boolean = false;


	zytoAccountURL = environment.zytoAccountURL;

	constructor(public globalState: GlobalState, private authService: AuthService, private router: Router) {
		this.globalState.subscribe('menu.isCollapsed', (isCollapsed) => {
			this.isMenuCollapsed = isCollapsed;
		});
	}

	public toggleMenu() {
		this.isMenuCollapsed = !this.isMenuCollapsed;
		this.globalState.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
		return false;
	}

	public scrolledChanged(isScrolled) {
		this.isScrolled = isScrolled;
	}

	logout() {
		this.authService.logout();
	}

	ngOnInit() {
		const self = this;
		this.authService.getProfile((err, profile) => {
			self.profile = profile;
		});

		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe((event: any) => {
				console.log('in page top bar:', event.url);

				const training_page_regex = /introduction$/i;

				const checkout_page_regex = /^(.*)(checkout-)(.*?)$/;

				if (training_page_regex.test(event.url)) {
					this.isTrainingPage = true;
				} else {
					this.isTrainingPage = false;
				}
				console.log(checkout_page_regex.test(event.url));
				if (checkout_page_regex.test(event.url)) {
					this.isNoSidebarPage = true;
				} else {
					this.isNoSidebarPage = false;
				}

				this.isSearchVisible = false;
				this.searchString = '';

			});

		this.globalState.trainingAlreadyCompleted.subscribe(change => {
			this.isAlreadyTrainingCompleted = change;
		});

	}

	searchPressed() {
        let inputField: HTMLElement = <HTMLElement>document.querySelectorAll('.searchfield')[0];
        // inputField && inputField.focus();
        inputField.focus();
		const self = this;
		if (this.isSearchVisible) {
			if (this.searchString) {
				console.log(this.router.url);

				const dashboardPageRegex = /dashboard/i;
				console.log('test:', dashboardPageRegex.test(this.router.url));

				if (!dashboardPageRegex.test(this.router.url)) {
					console.log(self.searchString);
					this.router.navigate(['/pages/dashboard'], { queryParams: { search: self.searchString } });
				} else {
					this.globalState.dashboardSearchQueryChangeEvent.emit(this.searchString);
				}
			}
		} else {
			this.isSearchVisible = true;
		}
	}
	backToDashboard() {
		this.globalState.showSidebar = true;
		this.router.navigate(['/pages/dashboard']);
	}
	backToHomePage() {
		this.router.navigate(['/']);
	}

}
