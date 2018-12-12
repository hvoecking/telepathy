import { ApplicationRef } from '@angular/core';
import { Component } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';
import { Input } from '@angular/core';
import { IpfsService } from '@services/ipfs.service';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Observable } from 'rxjs';
import { Room } from '@services/room.service';
import { RoomService } from '@services/room.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-page-rooms',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss'],
})
export class RoomsPage {

  public readonly search$ = new Subject<any>();

  private readonly rooms$ = merge(
    this.roomService.zonedEntities$,
    this.roomService.zonedFilteredEntities$,
  );
  private readonly loading$ = this.roomService.zonedLoading$;
  private readonly ipfsPeerId$ = from(this.ipfsService.ipfsInfo.then(info => info.id));

  // Works around the bug described here: https://github.com/ionic-team/ionic/issues/15345
  // TODO: Remove once updated to >=4.0.0-beta.16
  fixLoadingBug(loading) {
    loading.present();
    loading.dismiss();
    return(loading);
  }

  constructor(
    private router: Router,
    private app: ApplicationRef,
    private roomService: RoomService,
    private ipfsService: IpfsService,
    private loadingCtrl: LoadingController,
  ) {
    this.loadingCtrl.create({
      message: 'Loading rooms...',
    })
    .then(loading => this.fixLoadingBug(loading))
    .then(loading => this.roomService.loading$.subscribe(v => {
      console.log('loading:', loading)
      if (v) {
        loading.present();
      } else {
        loading.dismiss();
      }
      this.app.tick();
    }));
    this.roomService.loaded$.subscribe(v => {
      console.log('loaded:', v)
    });
  }

  ionViewWillEnter() {
    this.roomService.getAll();

    this.search$.pipe(
      throttleTime(300, void 0, {leading: true, trailing: true}),
      distinctUntilChanged(),
    ).subscribe(pattern => this.roomService.setFilter(pattern));
  }
}
