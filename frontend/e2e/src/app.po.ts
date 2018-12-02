/*!
 * Copyright 2018
 */

import { browser, by, element } from "protractor";

export class AppPage {

  public async getPageOneTitleText(): Promise<string> {
    return await element(by.tagName("app-home"))
      .element(by.deepCss("ion-title"))
      .getText();
  }

  public async navigateTo(destination: string): Promise<void> {
    const cap = await browser.getCapabilities();
    const browserName = cap.get("browserName");
    if (browserName === "") {
      return;
    }
    await browser.get(destination);
  }
}
