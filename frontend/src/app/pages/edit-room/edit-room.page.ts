/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { EntityAction, EntityOp, ofEntityOp } from "ngrx-data";
import { combineLatest, Observable, Subject } from "rxjs";
import { delay, filter, map, shareReplay, takeUntil } from "rxjs/operators";
import { Room, RoomService } from "~services/room.service";

@Component({
  selector: `edit-room`,
  styleUrls: [`./edit-room.page.scss`],
  templateUrl: `./edit-room.page.html`,
})
export class EditRoomPage {

  public readonly error$: Subject<string> = new Subject<string>();
  public form: FormGroup = this.formBuilder.group({});

  public readonly loading$: Observable<boolean> = this.roomService.zonedLoading$.pipe(
    delay(1),
  );
  public readonly room$: Subject<Room> = new Subject<Room>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly roomService: RoomService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  private readonly destroy$: Subject<void> = new Subject<void>();

  public async goBack(): Promise<void> {
    await this.router.navigate([`/rooms`]);
  }

  public async removeRoom(id: string): Promise<void> {
    this.roomService.delete(id);
    await this.goBack();
  }

  public async saveRoom(id: string, value: Partial<Room>): Promise<void> {
    const { dirty, valid }: FormGroup = this.form;
    if (dirty && valid) {
      const newValues = {
        id,
        name: value.name,
      };
      this.roomService.update(newValues);
      await this.goBack();
    }
  }

  protected ionViewWillEnter(): void {
    this.room$.subscribe((room: Room) => {
      this.form.addControl(`name`, new FormControl(room.name, Validators.required));
    });
    combineLatest(
      this.route.paramMap.pipe(
        map((paramMap: ParamMap) => paramMap.get(`id`)),
      ),
      this.roomService.entityMap$,
    ).pipe(
      map(([id, entityMap]: [string | null, {[key: string]: Room | undefined}]): Room | undefined => {
        if (id === null) {
          return undefined;
        }
        const room = entityMap[id];
        if (room === undefined) {
          this.roomService.getByKey(id);
        }
        return room;
      }),
      filter((room: Room | undefined) => room !== undefined),
      takeUntil(this.destroy$), // must be just before shareReplay
      shareReplay(1),
    ).subscribe(this.room$);

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
  }

  protected ionViewWillLeave(): void {
    this.destroy$.next();
  }
}
