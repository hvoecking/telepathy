import * as _ from 'lodash';
import * as uuid from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { EntityCollectionServiceBase } from 'ngrx-data';
import { EntityCollectionServiceElementsFactory } from 'ngrx-data';
import { EntityFunctions } from '@store/orbitdb-data.service';
import { EntityMetadataMap } from 'ngrx-data';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgZone } from "@angular/core";
import { PropsFilterFnFactory } from 'ngrx-data';
import { tap } from 'rxjs/operators';

class RoomFunctions implements EntityFunctions<Room> {

  name = () => 'Room';

  stringify = e => JSON.stringify(e);

  parse = s => Object.assign(new Room(), JSON.parse(s));

  update(original, changes) {
    const newEntity = new Room();
    Object.assign(newEntity, original);
    Object.assign(newEntity, changes);
    return newEntity;
  }

  query(query, all) {
    const params = new HttpParams(
      typeof query === 'string' ? {fromString: query} : {fromObject: query},
    );
    const includes = params.get('includes');
    return all.filter(e => e.name.toLowerCase().includes(includes))
  }
}

export class Room {

  public readonly address: string;
  public readonly id = uuid.v4();
  public readonly messageIds: string[];
  public readonly name: string;
  public readonly peerIds: string[];

  constructor(name?: string) {
    this.name = name;
  }

  static getEntityFunctions() {
    return new RoomFunctions();
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
export function nameFilter<T extends { name: string }>(entities: T[], pattern: string) {
  return PropsFilterFnFactory(['name'])(entities, pattern);
}

/** Sort Comparer to sort the entity collection by its name property */
export function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

@Injectable({
  providedIn: 'root',
})
export class RoomService extends EntityCollectionServiceBase<Room> {

  public readonly zonedEntities$ = this.doZone<Room[]>([], this.entities$);
  public readonly zonedFilteredEntities$ = this.doZone<Room[]>([], this.filteredEntities$);
  public readonly zonedLoading$ = this.doZone<boolean>(false, this.loading$);

  constructor(
    private readonly serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private readonly zone: NgZone,
  ) {
    super(new RoomFunctions().name(), serviceElementsFactory);
  }

  doZone<T>(initialValue, target$) {
    const zoned$ = new BehaviorSubject<T>(initialValue);
    target$.subscribe(v => this.zone.run(() => zoned$.next(v)));
    return zoned$;
  }
}
