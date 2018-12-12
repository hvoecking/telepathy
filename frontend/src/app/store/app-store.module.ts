import { DefaultDataServiceConfig } from 'ngrx-data';
import { EffectsModule } from '@ngrx/effects';
import { entityMetadata } from '@services/room.service';
import { EntityDataService } from 'ngrx-data';
import { env } from '@env';
import { IpfsService } from '@services/ipfs.service';
import { NgModule } from '@angular/core';
import { NgrxDataModule } from 'ngrx-data';
import { OrbitdbDataServiceFactory } from '@store/orbitdb-data.service';
import { Room } from '@services/room.service';
import { RoomService } from '@services/room.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    (env.versionBuildMode === 'production')
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
    private readonly entityDataService: EntityDataService,
    private readonly ipfsService: IpfsService,
    private readonly orbitdbDataServiceFactory: OrbitdbDataServiceFactory,
    private readonly roomService: RoomService,
  ) {
    const functions = Room.getEntityFunctions();
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
