/* tslint:disable */
/* eslint-disable */
/**
 * Parse M3U content and return categorized items
 */
export function parse_m3u(content: string): any;
/**
 * Get version information
 */
export function version(): string;
/**
 * Represents a parsed M3U item
 */
export class M3UItem {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly url: string;
  readonly logo: string | undefined;
  readonly group: string;
  readonly title: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_m3uitem_free: (a: number, b: number) => void;
  readonly m3uitem_group: (a: number, b: number) => void;
  readonly m3uitem_logo: (a: number, b: number) => void;
  readonly m3uitem_title: (a: number, b: number) => void;
  readonly m3uitem_url: (a: number, b: number) => void;
  readonly parse_m3u: (a: number, b: number, c: number) => void;
  readonly version: (a: number) => void;
  readonly __wbindgen_export: (a: number, b: number) => number;
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export3: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
