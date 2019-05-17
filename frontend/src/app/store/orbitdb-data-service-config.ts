/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

/**
 * Optional configuration settings for an entity collection data service
 */
export abstract class OrbitdbDataServiceConfig {
  // root path of the web api (default: 'api')
  public address?: string;
  // Simulate GET latency in a demo (default: 0)
  public getDelay?: number;
  // Simulate save method (PUT/POST/DELETE) latency in a demo (default: 0)
  public saveDelay?: number;
  // request timeout in MS (default: 0)
  public timeout?: number;
}
