import { browser, by, element } from 'protractor';

export class AppPage {
  async navigateTo(destination: string) {
    const cap = await browser.getCapabilities();
    const browserName = cap.get('browserName');
    if (browserName === '') {
      return;
    }
    await browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getPageOneTitleText() {
    return element(by.tagName('app-home')).element(by.deepCss('ion-title')).getText();
  }
}
