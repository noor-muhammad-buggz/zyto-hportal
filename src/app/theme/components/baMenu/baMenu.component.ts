import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { BaMenuService } from '../../services';
import { GlobalState } from '../../../global.state';

@Component({
	selector: 'ba-menu',
	templateUrl: './baMenu.html',
	styleUrls: ['./baMenu.scss']
})
export class BaMenu {

	@Input() sidebarCollapsed: boolean = false;
	@Input() menuHeight: number;

	@Output() expandMenu = new EventEmitter<any>();

	public menuItems: any[];
	protected _menuItemsSub: Subscription;
	public showHoverElem: boolean;
	public hoverElemHeight: number;
	public hoverElemTop: number;
	protected _onRouteChange: Subscription;
	public outOfArea: number = -200;

	constructor(private _router: Router, private _service: BaMenuService, private _state: GlobalState) {
	}

	public updateMenu(newMenuItems) {
    //console.log('in menu imtes');
    //console.log(newMenuItems);
    this.menuItems = newMenuItems;
    // this.menuItems.push(
		// 	{
		// 		path: 'introduction',  // path for our page
		// 		data: { // custom menu declaration
		// 			menu: {
		// 				title: 'Training', // menu title
		// 				icon: 'fa fa-caret-right', // menu icon
		// 				//pathMatch: 'prefix', // use it if item children not displayed in menu
		// 				selected: false,
		// 				expanded: false,
		// 				order: 0
		// 			}
		// 		}
		// 	}
    // );
		this.selectMenuAndNotify();
	}

	public selectMenuAndNotify(): void {
		if (this.menuItems) {
			this.menuItems = this._service.selectMenuItem(this.menuItems);
			this._state.notifyDataChanged('menu.activeLink', this._service.getCurrentItem());
		}
	}

	public ngOnInit(): void {
		this._onRouteChange = this._router.events.subscribe((event) => {

			if (event instanceof NavigationEnd) {
				if (this.menuItems) {
					this.selectMenuAndNotify();
				} else {
					// on page load we have to wait as event is fired before menu elements are prepared
					setTimeout(() => this.selectMenuAndNotify());
				}
			}
		});

		this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
	}

	public ngOnDestroy(): void {
		this._onRouteChange.unsubscribe();
		this._menuItemsSub.unsubscribe();
	}

	public hoverItem($event): void {
		this.showHoverElem = true;
		this.hoverElemHeight = $event.currentTarget.clientHeight;
		// TODO: get rid of magic 66 constant
		this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 92;
	}

	public toggleSubMenu($event): boolean {
		let submenu = jQuery($event.currentTarget).next();

		if (this.sidebarCollapsed) {
			this.expandMenu.emit(null);
			if (!$event.item.expanded) {
				$event.item.expanded = true;
			}
		} else {
			$event.item.expanded = !$event.item.expanded;
			submenu.slideToggle();
		}

		return false;
	}
}
