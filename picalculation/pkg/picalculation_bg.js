let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}
/**
 * @param {bigint} left
 * @param {bigint} right
 * @returns {bigint}
 */
export function add(left, right) {
    const ret = wasm.add(left, right);
    return BigInt.asUintN(64, ret);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * @returns {Uint8Array}
 */
export function calculate_series() {
    const ret = wasm.calculate_series();
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

/**
 * @returns {RamanujanSeries}
 */
export function get_ramanujan_series() {
    const ret = wasm.get_ramanujan_series();
    return RamanujanSeries.__wrap(ret);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @param {RamanujanSeries} series
 * @param {bigint} digits
 * @returns {Uint8Array}
 */
export function ramanujan_series_digits(series, digits) {
    _assertClass(series, RamanujanSeries);
    const ret = wasm.ramanujan_series_digits(series.__wbg_ptr, digits);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

/**
 * @returns {GosperSeries}
 */
export function get_gosper_series() {
    const ret = wasm.get_gosper_series();
    return GosperSeries.__wrap(ret);
}

/**
 * @param {GosperSeries} series
 * @param {number} num_digits
 * @returns {Uint8Array}
 */
export function gosper_stream(series, num_digits) {
    _assertClass(series, GosperSeries);
    const ret = wasm.gosper_stream(series.__wbg_ptr, num_digits);
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

const GosperSeriesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_gosperseries_free(ptr >>> 0, 1));

export class GosperSeries {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GosperSeries.prototype);
        obj.__wbg_ptr = ptr;
        GosperSeriesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GosperSeriesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gosperseries_free(ptr, 0);
    }
}
if (Symbol.dispose) GosperSeries.prototype[Symbol.dispose] = GosperSeries.prototype.free;

const RamanujanSeriesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ramanujanseries_free(ptr >>> 0, 1));

export class RamanujanSeries {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RamanujanSeries.prototype);
        obj.__wbg_ptr = ptr;
        RamanujanSeriesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RamanujanSeriesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ramanujanseries_free(ptr, 0);
    }
}
if (Symbol.dispose) RamanujanSeries.prototype[Symbol.dispose] = RamanujanSeries.prototype.free;

export function __wbg___wbindgen_throw_b855445ff6a94295(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

