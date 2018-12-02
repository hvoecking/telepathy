/*!
 * Copyright 2018
 */

import { AppPage } from "./app.po";

describe("new App", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe("default screen", () => {
    beforeEach(async () => {
      await page.navigateTo("/#home");
    });
    it("should have a title saying Home", async () => {
      const title = await page.getPageOneTitleText();
      await expect(title).toEqual("Home");
    });
  });
});
