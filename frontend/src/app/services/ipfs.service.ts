/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { Injectable } from "@angular/core";
import Ipfs from "ipfs";
import { env } from "~env";

const IPFS_RELAY =
  `/dnsaddr/${env.relayHost}/tcp` +
  `/${env.useSsl === `true` ? `443` : `80`}/ws` +
  `/ipfs/${env.ipfsIdentityPeerid}`;

function repo(): string {
  return `/ipfs/${env.applicationName}/0`;
}

const IPFS_CONFIG = {
  EXPERIMENTAL: {
    pubsub: true,
  },
  preload: {
    enabled: false,
  },
  relay: {
    enabled: true,
    hop: {
      enabled: true,
    },
  },
  repo: repo(),
};

async function connectSwarm(ipfs: Ipfs, address: string): Promise<void> {
  console.log(`connecting to: ${address}`);
  await ipfs.swarm.connect(address);
  console.log(`connected`);
}

// TODO: update angular
// tslint:disable-next-line: no-unsafe-any
@Injectable({
  providedIn: `root`,
})
export class IpfsService {

  public readonly ipfs: Promise<Ipfs>;
  public readonly ipfsId: Promise<string>;

  constructor() {
    this.ipfs = new Promise<Ipfs>((res: (ipfs: Ipfs) => void ): void => {
      const ipfs = new Ipfs(IPFS_CONFIG);
      ipfs.once(`ready`, async () => {
        console.log(`IPFS_RELAY:`, IPFS_RELAY);
        await connectSwarm(ipfs, IPFS_RELAY);
        res(ipfs);
      });
    });
    this.ipfsId = this.ipfs
      .then(async (ipfs: Ipfs): Promise<{id: string}> => ipfs.id())
      .then((info: {id: string}) => info.id);
  }

  public async connect(address: string): Promise<void> {
    const ipfs = await this.ipfs;
    await connectSwarm(ipfs, address);
  }
}
