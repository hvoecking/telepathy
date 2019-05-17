/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EntityDataService, NgrxDataModule } from "ngrx-data";
import { env } from "~env";
import { IpfsService } from "~services/ipfs.service";
import { entityMetadata, Room, RoomFunctions, RoomService } from "~services/room.service";
import { OrbitdbDataServiceFactory } from "~store/orbitdb-data.service";

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    (env.versionBuildMode === `production`)
      ? []
      : StoreDevtoolsModule.instrument(),
    NgrxDataModule.forRoot({entityMetadata}),
    StoreModule.forRoot({}),
  ],
  providers: [
    OrbitdbDataServiceFactory,
  ],
})
export class AppStoreModule {
  constructor(
    entityDataService: EntityDataService,
    ipfsService: IpfsService,
    orbitdbDataServiceFactory: OrbitdbDataServiceFactory,
    roomService: RoomService,
  ) {
    const functions = new RoomFunctions();
    entityDataService.registerService(
      functions.name(),
      orbitdbDataServiceFactory.create<Room>(
        functions,
        roomService,
        ipfsService,
      ),
    );
  }
}
