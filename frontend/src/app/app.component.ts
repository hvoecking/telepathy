/*!
 * Copyright 2018
 */

import { Component } from "@angular/core";

import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Platform } from "@ionic/angular";

interface AppPage {
  icon: string;
  title: string;
  url: string;
}

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  public appPages: AppPage[] = [
    {
      icon: "home",
      title: "Home",
      url: "/home",
    },
    {
      icon: "list",
      title: "List",
      url: "/list",
    },
  ];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  public initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }
}
