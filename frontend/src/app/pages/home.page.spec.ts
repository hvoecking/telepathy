/*!
 * Copyright 2018
 */

import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { HomePage } from "./home.page";

describe("HomePage", () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    await expect(component).toBeTruthy();
  });
});
