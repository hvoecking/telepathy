/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { ApplicationRef, Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EntityOp, ofEntityOp, EntityAction } from "ngrx-data";
import { Subject } from "rxjs";
import { delay, map, takeUntil } from "rxjs/operators";
import { Room, RoomService } from "~services/room.service";

@Component({
  selector: `create-room`,
  styleUrls: [`./create-room.page.scss`],
  templateUrl: `./create-room.page.html`,
})
export class CreateRoomPage {

  public readonly error$: Subject<string> = new Subject<string>();
  public readonly form: FormGroup = this.formBuilder.group({
    name: new FormControl(``, Validators.required),
  });
  public readonly room$: Subject<Room> = new Subject<Room>();

  constructor(
    private readonly app: ApplicationRef,
    private readonly formBuilder: FormBuilder,
    private readonly roomService: RoomService,
    private readonly router: Router,
  ) {
    this.ionViewWillEnter();
  }

  private readonly destroy$: Subject<void> = new Subject<void>();

  public async createRoom(newRoom: { name: string }): Promise<void> {
    const { dirty, valid }: FormGroup = this.form;
    if (dirty && valid) {
      this.roomService.add(new Room({name: newRoom.name, address: `example address`, seq: 0}));
      this.form.reset();
      await this.goBack();
    }
  }

  public async goBack(): Promise<void> {
    await this.router.navigate([`/rooms`]);
  }

  protected ionViewWillEnter(): void {
    this.roomService.errors$.pipe(
      ofEntityOp(EntityOp.QUERY_BY_KEY_ERROR),
      map(({ payload: { error } }: EntityAction) => (
        error !== undefined
          ? error.message
          : `Unknown error`
      )),
      // delay guards against `ExpressionChangedAfterItHasBeenCheckedError`
      delay(1),
      takeUntil(this.destroy$),
    ).subscribe(this.error$);
    this.app.tick();
  }

  protected ionViewWillLeave(): void {
    this.destroy$.next();
  }
}
