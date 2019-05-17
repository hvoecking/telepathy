/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { ApplicationRef, Component } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { Subject, from, Observable, merge } from "rxjs";
import { distinctUntilChanged, throttleTime } from "rxjs/operators";
import { IpfsService } from "~services/ipfs.service";
import { RoomService, Room } from "~services/room.service";

const THROTTLE_TIME = 300;

@Component({
  selector: `app-page-rooms`,
  styleUrls: [`rooms.page.scss`],
  templateUrl: `rooms.page.html`,
})
export class RoomsPage {

  public readonly ipfsPeerId$: Observable<string> = from(this.ipfsService.ipfsId);
  public readonly loading$: Subject<boolean> = this.roomService.zonedLoading$;

  public readonly rooms$: Observable<Room[]> = merge(
    this.roomService.zonedEntities$,
    this.roomService.zonedFilteredEntities$,
  );
  public readonly search$: Subject<string> = new Subject<string>();

  constructor(
    private readonly app: ApplicationRef,
    private readonly roomService: RoomService,
    private readonly ipfsService: IpfsService,
    private readonly loadingCtrl: LoadingController,
  ) {
    this.init()
    .catch((e: Error) => console.error(e));
  }

  // Works around the bug described here: https://github.com/ionic-team/ionic/issues/15345
  // TODO: Remove once updated to >=4.0.0-beta.16
  public async fixLoadingBug(loading: HTMLIonLoadingElement): Promise<HTMLIonLoadingElement> {
    await loading.present();
    await loading.dismiss();
    return loading;
  }

  protected ionViewWillEnter(): void {
    this.roomService.getAll();

    this.search$.pipe(
      throttleTime(THROTTLE_TIME, void 0, {leading: true, trailing: true}),
      distinctUntilChanged(),
    ).subscribe((pattern: string) => this.roomService.setFilter(pattern));
  }

  private async init(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: `Loading rooms...`,
    });
    await this.fixLoadingBug(loading);
    this.roomService.loading$.subscribe(async (v: boolean) => {
      console.log(`loading:`, loading);
      if (v) {
        await loading.present();
      } else {
        await loading.dismiss();
      }
      this.app.tick();
    });
    this.roomService.loaded$.subscribe((v: boolean) => {
      console.log(`loaded:`, v);
    });
  }
}
