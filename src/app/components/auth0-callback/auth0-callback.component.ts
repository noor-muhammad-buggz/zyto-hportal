import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalState } from '../../global.state';

@Component({
  selector: 'app-auth0-callback',
  templateUrl: './auth0-callback.component.html',
  styleUrls: ['./auth0-callback.component.scss']
})
export class Auth0CallbackComponent implements OnInit {

  constructor(private router: Router,public globalState: GlobalState) {
    this.globalState.showFullLoader = true;
    console.log('this.globalState.showFullLoader:',this.globalState.showFullLoader);
    if(window.location.hash) {
      // Fragment exists
    } else {
      this.router.navigate(["/"]);
      // Fragment doesn't exist
    }
   }

  ngOnInit() {
  }

}
