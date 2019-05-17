/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: ``,
    pathMatch: `full`,
    redirectTo: `splash`,
  },
  {
    loadChildren: `./pages/splash/splash.module#SplashPageModule`,
    path: `splash`,
  },
  {
    loadChildren: `./pages/connect-peer/connect-peer.module#ConnectPeerPageModule`,
    path: `connect-peer`,
  },
  {
    loadChildren: `./pages/create-room/create-room.module#CreateRoomPageModule`,
    path: `create-room`,
  },
  {
    loadChildren: `./pages/edit-room/edit-room.module#EditRoomPageModule`,
    path: `edit-room/:id`,
  },
  {
    loadChildren: `./pages/rooms/rooms.module#RoomsPageModule`,
    path: `rooms`,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {useHash: true})],
})
export class AppRoutingModule {}
