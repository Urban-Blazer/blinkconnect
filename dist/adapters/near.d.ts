import { A as AdapterHookResult } from '../types-Cw0KStB0.js';

interface NearAdapterOptions {
    networkId?: string;
}
/**
 * NEAR adapter — uses @hot-labs/near-connect.
 */
declare function useNearAdapter(options?: NearAdapterOptions): AdapterHookResult;

export { type NearAdapterOptions, useNearAdapter };
