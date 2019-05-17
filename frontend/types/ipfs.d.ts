declare module 'ipfs' {
  export default Ipfs;
  class Ipfs {
    constructor(options?: Options);
    swarm: SwarmAPI;
    id(): Promise<Id>;
    once(event: string, callback: () => void): this;
  }

  export interface Options {
    init?: boolean;
    start?: boolean;
    EXPERIMENTAL?: any;
    repo?: string;
    config?: any;
}

  export interface SwarmAPI {
    connect(maddr: Multiaddr | string): Promise<any>;
  }

  export interface Id {
    id: string;
  }

  export interface Multiaddr {
    buffer: Uint8Array;
  }
}
