import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver';

export class AppPage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/');
  }

  getTitleText(): promise.Promise<any> {
    return element(by.css('app-root h1')).getText();
  }
}
