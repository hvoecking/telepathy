import * as _ from 'lodash';
import { ApplicationRef } from '@angular/core';
import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { EntityOp } from 'ngrx-data';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofEntityOp } from 'ngrx-data';
import { Room } from '@services/room.service';
import { RoomService } from '@services/room.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Validators } from '@angular/forms';

@Component({
  selector: 'create-room',
  templateUrl: './create-room.page.html',
  styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage {

  public readonly form: FormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required),
  });
  public error$: Observable<string>;
  public room$: Observable<Room>;

  private readonly destroy$ = new Subject();

  constructor(
    private readonly app: ApplicationRef,
    private readonly formBuilder: FormBuilder,
    private readonly roomService: RoomService,
    private readonly router: Router,
  ) { }

  ionViewWillEnter() {
    this.error$ = this.roomService.errors$.pipe(
      ofEntityOp(EntityOp.QUERY_BY_KEY_ERROR),
      map(errorAction => errorAction.payload.error.message),
      // delay guards against `ExpressionChangedAfterItHasBeenCheckedError`
      delay(1),
      takeUntil(this.destroy$),
    );
    this.app.tick();
  }

  ionViewWillLeave() {
    this.destroy$.next();
  }

  goBack() {
    this.router.navigate(['/rooms']);
  }

  createRoom(newRoom) {
    const { dirty, valid } = this.form;
    if (dirty && valid) {
      this.roomService.add(new Room(newRoom.name));
      this.form.reset();
      this.goBack();
    }
  }
}
