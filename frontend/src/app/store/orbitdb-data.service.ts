import * as _ from 'lodash';
import * as OrbitDB from 'orbit-db';
import * as uuid from 'uuid';
import { catchError } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EntityCollectionDataService } from 'ngrx-data';
import { EntityCollectionServiceBase } from 'ngrx-data';
import { filter } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { flatMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { fromEvent } from 'rxjs';
import { Injectable } from '@angular/core';
import { IpfsService } from '@services/ipfs.service';
import { map } from 'rxjs/operators';
import { mapTo } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Optional } from '@angular/core';
import { OrbitdbDataServiceConfig } from '@store/orbitdb-data-service-config';
import { QueryParams } from 'ngrx-data';
import { shareReplay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Update } from 'ngrx-data';

type KeyvalueWriteOp = 'put' | 'del';

export interface IKeyable {
  readonly id: string;
}

export interface EntityFunctions<T> {
  name(): string;
  stringify(entity: T): string;
  parse(stringified: string): T;
  update(original: T, changes: Partial<T>): T;
  query(query: QueryParams|string, all: T[]): T[];
}

/**
 * An entity data service using an orbit-db keyvalue store as a backend
 */
export class OrbitdbDataService<T extends IKeyable>
  implements EntityCollectionDataService<T> {

  private _name: string;
  private entityName: string;
  private getDelay = 0;
  private odbStoreWrite$ = new Subject<string>();
  private readonly odbStore;
  private readonly orbitdb;
  private saveDelay = 0;
  private timeout = 0;

  get name() {
    return this._name;
  }

  constructor(
    private readonly entityFunctions: EntityFunctions<T>,
    private readonly service: EntityCollectionServiceBase<T>,
    private readonly ipfsService: IpfsService,
    private readonly config?: OrbitdbDataServiceConfig,
  ) {
    this.entityName = this.entityFunctions.name();
    this._name = `${this.entityName} OrbitdbDataService`;
    const {
      getDelay = 0,
      saveDelay = 0,
      timeout: to = 0,
    } = config || {};
    this.getDelay = getDelay;
    this.saveDelay = saveDelay;
    this.timeout = to;
    this.orbitdb = this.ipfsService.ipfs.then(ipfs => new OrbitDB(ipfs));
    this.odbStore = this.orbitdb.then(odb => this.setupStore(odb));
  }

  private doWrite(
    op: KeyvalueWriteOp,
    key: string | number,
    value?: string,
  ): Observable<null> {
    return from(this.odbStore).pipe(
      map(store => store[op](key, value)),
      flatMap(hash => combineLatest([this.odbStoreWrite$, from(hash)])),
      filter(([result, hash]) => (result as any).hash === hash),
      first(),
      mapTo(null),
    );
  }

  private async setupStore(odb) {
    const store = await odb.keyvalue(this.entityName, {write: ['*']});
    const address = store.address.toString();
    console.log('Connected to orbit-db:', address)

    merge(
      fromEvent(store.events, 'load'),
      fromEvent(store.events, 'replicate'),
    ).subscribe(() => {
      this.service.setLoaded(false);
      this.service.setLoading(true);
    });

    merge(
      fromEvent(store.events, 'ready'),
      fromEvent(store.events, 'replicated'),
    ).subscribe(() => {
      this.service.load();
      this.service.setLoading(false);
      this.service.setLoaded(true);
    });

    fromEvent(store.events, 'write', (address, hash) => hash)
      .subscribe(hash => {
        console.log('hash:', hash)
        this.odbStoreWrite$.next(hash)
      });

    await store.load();
    return store;
  }

  add(entity: T): Observable<T> {
    if (!entity) {
      return throwError(new Error(`No "${this.entityName}" entity to add`));
    }
    const stringified = this.entityFunctions.stringify(entity);
    return this.doWrite('put', entity.id, stringified).pipe(
      mapTo(entity),
    );
  }

  delete(key: number|string): Observable<number|string> {
    if (key == null) {
      return throwError(new Error(`No "${this.entityName}" key to delete`));
    }
    return this.doWrite('del', key).pipe(
      mapTo(key),
    );
  }

  getAll(): Observable<T[]> {
    return from((async () => {
      const store = await this.odbStore;
      const index = await store.all();
      return _(index)
        .values()
        .map(v => this.entityFunctions.parse(v))
        .orderBy('seq')
        .value();
    })());
  }

  getById(key: number|string): Observable<T> {
    if (key == null) {
      return throwError(new Error(`No "${this.entityName}" key to get`));
    }
    return from(this.odbStore).pipe(
      map(store => (store as any).get(key)),
      map(s => this.entityFunctions.parse(s)),
    );
  }

  getWithQuery(query: QueryParams|string): Observable<T[]> {
    return this.getAll().pipe(
      map(all => this.entityFunctions.query(query, all)),
    );
  }

  update(update: Update<T>): Observable<T> {
    if (update == null) {
      return throwError(new Error(`No "${this.entityName}" update data`));
    }
    const id = update.id;
    if (id == null) {
      return throwError(new Error(`No "${this.entityName}" update id`));
    }
    return this.getById(id).pipe(
      map(oldEntity => {
        if (!oldEntity) {
          throw new Error(`No entry for "${this.entityName}" with id "${id}"`);
        }
        return this.entityFunctions.update(oldEntity, update.changes);
      }),
      flatMap(newEntity => {
        return this.doWrite('put', id, JSON.stringify(newEntity)).pipe(
          mapTo(newEntity),
        );
      }),
    );
  }

  upsert(entity: T): Observable<T> {
    return this.add(entity);
  }
}

@Injectable()
export class OrbitdbDataServiceFactory {
  
  constructor(
    @Optional() private readonly config?: OrbitdbDataServiceConfig,
  ) {
    this.config = this.config || {};
  }

  create<T extends IKeyable>(
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