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
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { RoomsPage } from "~pages/rooms/rooms.page";
import { RoomService } from "~services/room.service";

@NgModule({
  declarations: [
    RoomsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      component: RoomsPage,
      path: ``,
    }]),
  ],
  providers: [
    RoomService,
  ],
})
export class RoomsPageModule {}
