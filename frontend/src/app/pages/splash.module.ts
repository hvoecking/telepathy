/*!
 * Copyright 2018
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SplashPage } from "~pages/splash.page";

@NgModule({
  declarations: [SplashPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        component: SplashPage,
        path: ``,
      },
    ]),
  ],
})
export class SplashPageModule {}
