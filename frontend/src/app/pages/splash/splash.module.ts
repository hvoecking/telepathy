/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SplashPage } from "./splash.page";

@NgModule({
  declarations: [SplashPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      component: SplashPage,
      path: ``,
    }]),
  ],
})
export class SplashPageModule {}
