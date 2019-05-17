/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
// tslint:disable-next-line: max-line-length
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory, EntityMetadataMap, PropsFilterFnFactory } from "ngrx-data";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import * as uuid from "uuid";
import { EntityFunctions } from "~store/orbitdb-data.service";

export class Room {

  public readonly address: string;
  public readonly id: string;
  public readonly messageIds: string[];
  public readonly name: string;
  public readonly peerIds: string[];
  public readonly seq: number;

  constructor(primary?: Partial<Room>, secondary?: Partial<Room>) {
    const complete = {
      address: undefined,
      id: uuid.v4(),
      messageIds: [],
      name: undefined,
      peerIds: [],
      seq: undefined,
      ...secondary,
      ...primary,
    };
    if (complete.address === undefined) {
      throw new Error(`Address is missing in ${complete}`);
    }
    if (complete.name === undefined) {
      throw new Error(`Name is missing in ${complete}`);
    }
    if (complete.seq === undefined) {
      throw new Error(`Seq is missing in ${complete}`);
    }
    this.address = complete.address;
    this.id = complete.id;
    this.messageIds = complete.messageIds;
    this.name = complete.name;
    this.peerIds = complete.peerIds;
    this.seq = complete.seq;
  }
}

export class RoomFunctions implements EntityFunctions<Room> {

  public name = (): string => `Room`;

  public parse = (s: string): Room => new Room(JSON.parse(s) as Partial<Room>);

  public query(query: string | {}, all: ReadonlyArray<Room>): Room[] {
    const params = new HttpParams(
      typeof query === `string` ? {fromString: query} : {fromObject: query},
    );
    const includes = params.get(`includes`);
    return all.filter((e: Room) => e.name.toLowerCase().includes(includes !== null ? includes : `.*`));
  }

  public stringify = (e: {}): string => JSON.stringify(e);

  public update(original: Room, changes: Partial<Room>): Room {
    return new Room(changes, original);
  }
}

export const entityMetadata: EntityMetadataMap = {
  Room: {
    filterFn: nameFilter, // optional
    sortComparer: sortByName, // optional
  },
};

// FILTERS AND SORTERS

// Can't embed these functions directly in the entityMetadata literal because
// AOT requires us to encapsulate the logic in wrapper functions

/** Filter for entities whose name matches the case-insensitive pattern */
export function nameFilter<T extends { name: string }>(entities: T[], pattern: string): { name: {} }[] {
  return PropsFilterFnFactory([`name`])(entities, pattern);
}

/** Sort Comparer to sort the entity collection by its name property */
export function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

// tslint:disable-next-line: no-unsafe-any
@Injectable({
  providedIn: `root`,
})
export class RoomService extends EntityCollectionServiceBase<Room> {

  public readonly zonedEntities$: Subject<Room[]> = this.doZone<Room[]>([], this.entities$);
  public readonly zonedFilteredEntities$: Subject<Room[]> = this.doZone<Room[]>([], this.filteredEntities$);
  public readonly zonedLoading$: Subject<boolean> = this.doZone<boolean>(false, this.loading$);

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private readonly zone: NgZone,
  ) {
    super(new RoomFunctions().name(), serviceElementsFactory);
  }

  public doZone<T>(initialValue: T, target$: Observable<T>): BehaviorSubject<T> {
    const zoned$ = new BehaviorSubject<T>(initialValue);
    target$.subscribe((v: T) => this.zone.run(() => zoned$.next(v)));
    return zoned$;
  }
}
