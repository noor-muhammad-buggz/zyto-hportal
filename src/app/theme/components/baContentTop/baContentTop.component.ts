import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GlobalState } from "../../../global.state";

@Component({
  selector: "ba-content-top",
  styleUrls: ["./baContentTop.scss"],
  templateUrl: "./baContentTop.html"
})
export class BaContentTop implements OnInit, AfterViewInit {
  public activePageTitle: string = "";

  constructor(
    public globalState: GlobalState
  ) {
    console.log("in BaContentTop");
    this.globalState.subscribe("menu.activeLink", activeLink => {
      console.log("in menu.activeLink");
      console.log(activeLink);
      console.log(this.globalState.currentPageTitle);
      // this.activePageTitle = this.globalState.currentPageTitle;
      if (activeLink) {
        this.activePageTitle =
          this.globalState.currentPageTitle || activeLink.title;
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
  }
}
