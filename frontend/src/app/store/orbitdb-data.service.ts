/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { Injectable, Optional } from "@angular/core";
import Ipfs from "ipfs";
import * as _ from "lodash";
import { EntityCollectionDataService, EntityCollectionServiceBase, QueryParams, Update } from "ngrx-data";
import OrbitDB from "orbit-db";
import { KeyValueStore } from "orbit-db-kvstore";
import { combineLatest, from, fromEvent, merge, Observable, Subject, throwError } from "rxjs";
import { filter, first, flatMap, map, mapTo } from "rxjs/operators";
import { IpfsService } from "~services/ipfs.service";
import { OrbitdbDataServiceConfig } from "~store/orbitdb-data-service-config";

export interface Keyable {
  readonly id: string;
  readonly seq: number;
}

export interface EntityFunctions<T> {
  name(): string;
  parse(stringified: string): T;
  query(query: QueryParams | string, all: T[]): T[];
  stringify(entity: T): string;
  update(original: T, changes: Partial<T>): T;
}

/**
 * An entity data service using an orbit-db keyvalue store as a backend
 */
export class OrbitdbDataService<T extends Keyable>
  implements EntityCollectionDataService<T> {

  public get name(): string {
    return this._name;
  }

  constructor(
    private readonly entityFunctions: EntityFunctions<T>,
    private readonly service: EntityCollectionServiceBase<T>,
    private readonly ipfsService: IpfsService,
    config?: OrbitdbDataServiceConfig,
  ) {
    this.entityName = this.entityFunctions.name();
    this._name = `${this.entityName} OrbitdbDataService`;
    const {
//      getDelay = 0,
      // saveDelay = 0,
      // timeout: to = 0,
    }: OrbitdbDataServiceConfig = config !== undefined ? config : {};
    // this.getDelay = getDelay;
    // this.saveDelay = saveDelay;
    // this.timeout = to;
    this.orbitdb = this.ipfsService.ipfs
      .then(async (ipfs: Ipfs): Promise<OrbitDB> => OrbitDB.createInstance(ipfs));
    this.odbStore = this.orbitdb.then(async (odb: OrbitDB): Promise<KeyValueStore<string>> => this.setupStore(odb));
    // console.log(`this.getDelay:`, this.getDelay);
    // console.log(`this.saveDelay:`, this.saveDelay);
    // console.log(`this.timeout:`, this.timeout);
  }

  private readonly _name: string;
  private readonly entityName: string;
  // private readonly getDelay: number;
  private readonly odbStore: Promise<KeyValueStore<string>>;
  private readonly odbStoreWrite$: Subject<{ hash: string }> = new Subject<{ hash: string }>();
  private readonly orbitdb: Promise<OrbitDB>;
  // private readonly saveDelay: number;
  // private readonly timeout: number;

  public add(entity: T): Observable<T> {
    if (entity === undefined) {
      return throwError(new Error(`No "${this.entityName}" entity to add`));
    }
    const stringified = this.entityFunctions.stringify(entity);
    return from(this.odbStore).pipe(
      map(async (store: KeyValueStore<string>): Promise<string> => store.put(entity.id, stringified)),
      flatMap((hash: Promise<string>) => combineLatest([this.odbStoreWrite$, from(hash)])),
      filter(([result, hash]: [{hash: string}, string]) => result.hash === hash),
      first(),
      mapTo(entity),
    );
  }

  public delete(key: number | string): Observable<number | string> {
    if (key === ``) {
      return throwError(new Error(`No "${this.entityName}" key to delete`));
    }
    return from(this.odbStore).pipe(
// tslint:disable-next-line: no-unsafe-any no-any
      map((store: any): string => store.del(key).toString()),
      flatMap((hash: string) => combineLatest([this.odbStoreWrite$, from(hash)])),
      filter(([result, hash]: [{hash: string}, string]) => result.hash === hash),
      first(),
      mapTo(key),
    );
  }

  public getAll(): Observable<T[]> {
    return from((async (): Promise<T[]> => {
      const store = await this.odbStore;
      return _.orderBy(
        _.map(store.all as string[], (s: string): T => this.entityFunctions.parse(s)),
        ({seq}: T) => seq,
      );
    })());
  }

  public getById(key: number | string): Observable<T> {
    if (key === ``) {
      return throwError(new Error(`No "${this.entityName}" key to get`));
    }
    return from(this.odbStore).pipe(
      map((store: KeyValueStore<string>) => store.get(key.toString())),
      map((s: string) => this.entityFunctions.parse(s)),
    );
  }

  public getWithQuery(query: QueryParams | string): Observable<T[]> {
    return this.getAll().pipe(
      map((all: T[]) => this.entityFunctions.query(query, all)),
    );
  }

  public update(update?: Update<T>): Observable<T> {
    if (update === undefined) {
      return throwError(new Error(`No "${this.entityName}" update data`));
    }
    const id = update.id;
    if (id === ``) {
      return throwError(new Error(`No "${this.entityName}" update id`));
    }
    return this.getById(id).pipe(
      map((oldEntity?: T) => {
        if (oldEntity === undefined) {
          throw new Error(`No entry for "${this.entityName}" with id "${id}"`);
        }
        return this.entityFunctions.update(oldEntity, update.changes);
      }),
      flatMap((newEntity: T) => {
        return from(this.odbStore).pipe(
          map(async (store: KeyValueStore<string>): Promise<string> => store.put(
            id.toString(), JSON.stringify(newEntity))),
          flatMap((hash: Promise<string>) => combineLatest([this.odbStoreWrite$, from(hash)])),
          filter(([result, hash]: [{hash: string}, string]) => result.hash === hash),
          first(),
          mapTo(newEntity),
        );
      }),
    );
  }

  public upsert(entity: T): Observable<T> {
    return this.add(entity);
  }

  private async setupStore(odb: OrbitDB): Promise<KeyValueStore<string>> {
    const store = await odb.open(this.entityName, {
      // If "Public" flag is set, allow anyone to write to the database,
      // otherwise only the creator of the database can write
      accessController: {
        write: [`*`],
      },
      // If database doesn't exist, create it
      create: true,
      // Load only the local version of the database,
      // don't load the latest from the network yet
      localOnly: false,
      overwrite: true,
      type: `keyvalue`,
    }) as KeyValueStore<string>;

    console.log(`Connected to orbit-db:`, store.address.toString());

    merge(
      fromEvent(store.events, `load`),
      fromEvent(store.events, `replicate`),
    ).subscribe(() => {
      this.service.setLoaded(false);
      this.service.setLoading(true);
    });

    merge(
      fromEvent(store.events, `ready`),
      fromEvent(store.events, `replicated`),
    ).subscribe(() => {
      this.service.load();
      this.service.setLoading(false);
      this.service.setLoaded(true);
    });

    fromEvent(store.events, `write`)
      .subscribe((value: {}): void => {
        const [address, entry, heads]: [string, { hash: string }, {}] = value as [string, { hash: string }, {}];
        console.log(`hash:`, address, entry, heads);
        this.odbStoreWrite$.next(entry);
      });

    await store.load();
    return store;
  }
}

// tslint:disable-next-line: no-unsafe-any
@Injectable()
export class OrbitdbDataServiceFactory {

  constructor(
    @Optional() private readonly config?: OrbitdbDataServiceConfig,
  ) {
    this.config = this.config !== undefined ? this.config : {};
  }

  public create<T extends Keyable>(
    functions: EntityFunctions<T>,
    roomService: EntityCollectionServiceBase<T>,
    ipfsSerice: IpfsService,
  ): EntityCollectionDataService<T> {
    return new OrbitdbDataService<T>(
      functions,
      roomService,
      ipfsSerice,
      this.config,
    );
  }
}
