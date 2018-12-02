/*!
 * Copyright 2018
 */

import { getTestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import "zone.js/dist/zone-testing";

interface RequireContext {
  keys(): string[];
  (id: string): {};
}
interface RequireFunction {
  context(path: string, deep?: boolean, filter?: RegExp): RequireContext;
}
declare var require: RequireFunction;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context = require.context("./", true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
