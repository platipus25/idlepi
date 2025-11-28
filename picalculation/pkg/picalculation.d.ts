/* tslint:disable */
/* eslint-disable */
export function add(left: bigint, right: bigint): bigint;
export function calculate_series(): Uint8Array;
export function get_ramanujan_series(): RamanujanSeries;
export function ramanujan_series_digits(series: RamanujanSeries, digits: bigint): Uint8Array;
export function get_gosper_series(): GosperSeries;
export function gosper_stream(series: GosperSeries): Uint8Array;
export class GosperSeries {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
}
export class RamanujanSeries {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
}
