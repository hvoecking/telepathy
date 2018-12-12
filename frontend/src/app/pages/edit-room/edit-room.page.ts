import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { EntityOp } from 'ngrx-data';
import { filter } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofEntityOp } from 'ngrx-data';
import { Room } from '@services/room.service';
import { RoomService } from '@services/room.service';
import { Router } from '@angular/router';
import { shareReplay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Validators } from '@angular/forms';

@Component({
  selector: 'edit-room',
  styleUrls: ['./edit-room.page.scss'],
  templateUrl: './edit-room.page.html',
})
export class EditRoomPage {

  public readonly loading$ = this.roomService.zonedLoading$.pipe(
    delay(1),
  );
  public error$: Observable<string>;
  public form: FormGroup;
  public room$: Observable<Room>;

  private readonly destroy$ = new Subject();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly roomService: RoomService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ionViewWillEnter() {
    this.room$ = combineLatest(
      this.route.paramMap.pipe(map(paramMap => paramMap.get('id'))),
      this.roomService.entityMap$,
    ).pipe(
      map(([id, entityMap]) => {
        const room = entityMap[id];
        if (!room) {
          this.roomService.getByKey(id);
        }
        return room;
      }),
      filter(room => !!room),
      takeUntil(this.destroy$), // must be just before shareReplay
      shareReplay(1),
    );
    this.room$.subscribe(room => {
      this.form = this.formBuilder.group({
        name: new FormControl(room.name, Validators.required),
      });
    });

    this.error$ = this.roomService.errors$.pipe(
      ofEntityOp(EntityOp.QUERY_BY_KEY_ERROR),
      map(errorAction => errorAction.payload.error.message),
      // delay guards against `ExpressionChangedAfterItHasBeenCheckedError`
      delay(1),
      takeUntil(this.destroy$),
    );
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }

  goBack() {
    this.router.navigate(['/rooms']);
  }

  async saveRoom(id, value) {
    const { dirty, valid } = this.form;
    if (dirty && valid) {
      let newValues = {
        id: id,
        name: value.name,
      }
      this.roomService.update(newValues);
      this.goBack();
    }
  }

  removeRoom(id) {
    this.roomService.delete(id);
    this.goBack();
  }
}
