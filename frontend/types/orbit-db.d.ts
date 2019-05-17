
declare module "orbit-db-keystore" {
  export default class {
  }
}
declare module "orbit-db-identity-provider" {
  export class Identity {
  }
}
declare module "orbit-db-store" {
  import { EventEmitter } from 'events';
  export class Store {
    address: { root: string, path: string };
    events: EventEmitter;
    load(amount?: number): Promise<void>;
  }
}
declare module "orbit-db-kvstore" {
  import { Store } from "orbit-db-store";
  export class KeyValueStore<V> extends Store {
    all: any[];
    constructor(ipfs: any, id: any, dbname: any, options: any);
    close(): any;
    del(key: any): any;
    drop(): void;
    get(key: string): V;
    loadFromSnapshot(onProgressCallback: any): any;
    loadMoreFrom(amount: any, entries: any): void;
    put(key: any, data: any): Promise<string>;
    saveSnapshot(): any;
    set(key: any, data: any): any;
    sync(heads: any): any;
  }
}

declare module 'orbit-db' {
  import Ipfs from 'ipfs';
  import Keystore from 'orbit-db-keystore';
  import { Identity } from "orbit-db-identity-provider";
  import { Store } from "orbit-db-store";

  export class OrbitDB {
    static createInstance(ipfs: Ipfs, options?: {
      directory: string,
      peerId?: string,
      keystore?: Keystore,
      cache: Cache,
      identity: Identity,
    }): OrbitDB;

    open(address: string, options?: {}): Promise<Store>;
  }
  export default OrbitDB;
}
