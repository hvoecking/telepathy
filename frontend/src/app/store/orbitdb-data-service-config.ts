/**
 * Optional configuration settings for an entity collection data service
 */
export abstract class OrbitdbDataServiceConfig {
  /** root path of the web api (default: 'api') */
  address?: string;
  /** Simulate GET latency in a demo (default: 0) */
  getDelay?: number;
  /** Simulate save method (PUT/POST/DELETE) latency in a demo (default: 0) */
  saveDelay?: number;
  /** request timeout in MS (default: 0)*/
  timeout?: number; //
}
