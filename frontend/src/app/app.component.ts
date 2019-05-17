/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
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
  selector: `app-root`,
  templateUrl: `app.component.html`,
})
export class AppComponent {
  public appPages: AppPage[] = [
    {
      icon: `home`,
      title: `Home`,
      url: `/home`,
    },
    {
      icon: `list`,
      title: `List`,
      url: `/list`,
    },
  ];

  constructor(
    private readonly platform: Platform,
    private readonly statusBar: StatusBar,
  ) {
    this.initializeApp().catch((e: {}) => console.error(e));
  }

  public async initializeApp(): Promise<void> {
    await this.platform.ready();
    this.statusBar.styleDefault();
  }
}
