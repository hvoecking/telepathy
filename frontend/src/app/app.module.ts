/*!
 * Copyright 2018
 */

import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppStoreModule } from "./store/app-store.module";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AppRoutingModule, //
    AppStoreModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
  ],
  providers: [
    StatusBar,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
})
export class AppModule {}
