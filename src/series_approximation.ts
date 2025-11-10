

let factorial_array: bigint[] = [];

function int_factorial(x: number): bigint {
    if (x === 0) {
        return 1n;
    }

    let val = factorial_array.at(x);
    if (val !== undefined) {
        return val
    }

    val = BigInt(x) * int_factorial(x - 1);
    factorial_array.splice(x, 0, val);

    return val
}

function *ramanujan_terms(start: number, end: number): Generator<[bigint, bigint]> {
    for (let k = start;k < end; k++) {
        yield [int_factorial(4 * k) * (1103n + 26390n * BigInt(k)), (int_factorial(k) ** 4n * 396n**(4n * BigInt(k)))]
    }
}

function ramanujan_series(num_terms: number) {
    
    let terms = ramanujan_terms(0, num_terms)

    // n/d + a/b = (n*b + a*d)/(d * b)
    let numerator = 0n;
    let denominator = 1n;
    for (let [a, b] of terms) {
        numerator = a * denominator + b * numerator;
        denominator *= b
    }

    const coeff = 2 * Math.SQRT2 / 9801;
    console.log(numerator, denominator);

    return coeff * Number(numerator) / Number(denominator);
}

console.log(int_factorial(10))
for (let i = 1; i < 30; i++) {
    console.log(factorial_array.length)
    console.log(1/ramanujan_series(i))
}