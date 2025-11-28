/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const add: (a: bigint, b: bigint) => bigint;
export const calculate_series: () => [number, number];
export const get_ramanujan_series: () => number;
export const ramanujan_series_digits: (a: number, b: bigint) => [number, number];
export const __wbg_ramanujanseries_free: (a: number, b: number) => void;
export const __wbg_gosperseries_free: (a: number, b: number) => void;
export const get_gosper_series: () => number;
export const gosper_stream: (a: number) => [number, number];
export const __wbindgen_externrefs: WebAssembly.Table;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_start: () => void;
