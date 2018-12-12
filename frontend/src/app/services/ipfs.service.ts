import * as Ipfs from 'ipfs';
import { Injectable } from '@angular/core';
import { env } from '@env';

const IPFS_RELAY =
  `/dnsaddr/${env.ipfsHost}/tcp/${env.ipfsWebsocketPort}/ws/ipfs/${env.ipfsIdentityPeerid}`;

function repo() {
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

async function connectSwarm(ipfs, address) {
  console.error('connecting to:', address)
  await new Promise((res, rej) => ipfs.swarm.connect(address, err => {
    if (err) {
      return rej(err);
    }
    console.log('IPFS swarm connect: ' + address)
    res();
  }));
}

@Injectable({
  providedIn: 'root',
})
export class IpfsService {

  public readonly ipfs;
  public readonly ipfsInfo;

  constructor() {
    console.log('env:', env)
    this.ipfs = new Promise<any>((res, rej) => {
      const ipfs = new Ipfs(IPFS_CONFIG);
      ipfs.once('ready', async () => {
        console.log('/ip4/127.0.0.1/tcp/4043/ws/ipfs/QmSu7h6RhaFG2s2dG3YajgjS88dFkkhGJTGNi36JAYZWKm')
        console.log('IPFS_RELAY:', IPFS_RELAY)
        await connectSwarm(ipfs, IPFS_RELAY);
        res(ipfs);
      });
    });
    this.ipfsInfo = this.ipfs.then(ipfs => {
      return new Promise<any>((res, rej) => {
        ipfs.id((err, info) => {
          if (err) {
            rej(err);
          }
          console.log('IPFS node ready with id: ' + info.id);
          res(info);
        });
      });
    });
  }

  async connect(address) {
    const ipfs = await this.ipfs;
    connectSwarm(ipfs, address);
  }
}
