/*!
 * Copyright 2018
 */

import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { ListPage } from "~pages/list.page";

describe("ListPage", () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let listPage: HTMLElement;

  beforeEach(async(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    await expect(component).toBeTruthy();
  });

  it("should have a list of 10 elements", async () => {
    listPage = fixture.nativeElement;
    const items = listPage.querySelectorAll("ion-item");
    await expect(items.length).toEqual(component.numberOfItems);
  });
});
