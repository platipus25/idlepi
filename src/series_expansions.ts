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

function gcd(a: bigint, b: bigint): bigint {
    if (b === 0n) {
        return a;
    }
    return gcd(b, a % b);
}

function reduce(num: bigint, denom: bigint): [bigint, bigint] {
    const d = gcd(num, denom);
    //console.log(d, num, denom)
    if (d < num && d < denom) {
        num /= d;
        denom /= d;
    }
    return [num, denom];
}

function sqrt_newtons_method(val: bigint, guess: bigint, num_iterations: number): [bigint, bigint] {
    // Objective is f(x) = x^2 - val = 0
    // Newton's method reformulates this into a fixed point method
    // g(x) = x - f(x)/f'(x)

    let numerator = guess;
    let denominator = 1n;

    for (let i = 0; i < num_iterations; i++) {
        //let update = (x**2n - val) / (2n * x);
        //let new_x = (x + val / x) / 2n;

        // 1/2 n/d + d/n * val= (n + 2d^2 * val)/ (2dn)
        const tmp = numerator;

        numerator **= 2n;
        numerator += denominator**2n * val;

        denominator *= 2n * tmp;

        /*if (update < tolerance) {
            break;
        }*/
        if (i % 10 == 0) {
            [numerator, denominator] = reduce(numerator, denominator)
        }
    }

    return [numerator, denominator]
}


function *ramanujan_terms(start: number, end: number): Generator<[bigint, bigint]> {
    for (let k = start;k < end; k++) {
        yield [int_factorial(4 * k) * (1103n + 26390n * BigInt(k)), (int_factorial(k) ** 4n * 396n**(4n * BigInt(k)))]
    }
}

function ramanujan_series_sum(num_terms: number): [bigint, bigint] {
    let terms = ramanujan_terms(0, num_terms)

    // n/d + a/b = (n*b + a*d)/(d * b)
    let numerator = 0n;
    let denominator = 1n;
    for (let [a, b] of terms) {
        numerator = a * denominator + b * numerator;
        denominator *= b;
        //[numerator, denominator] = reduce(numerator, denominator)
    }


    const coeff = 2 * Math.SQRT2 / 9801;

    return [numerator, denominator];
}

function ramanujan_series_approx(num_terms: number) {
    let [n, d] = ramanujan_series_sum(num_terms);
    const coeff = 2 * Math.SQRT2 / 9801; 
    return 1/(coeff * Number(n) / Number(d));
}

function ramanujan_series(num_terms: number): [bigint, bigint] {
    let [num, denom] = ramanujan_series_sum(num_terms);
    let [n, d] = sqrt_newtons_method(2n, 1n, 2*num_terms);

    return [denom * 9801n * n, num * 4n * d];
}

function *rational_to_decimal(numerator: bigint, denominator: bigint) {
    let digit;
    
    for (let n = 0; ; n++) {
        digit = numerator/denominator;

        numerator *= 10n;
        numerator -= digit * denominator * 10n;

        yield digit;
    }
}

//console.log(sqrt_newtons_method(4n, 5))

/*
console.log(sqrt_newtons_method(2n, 10))
console.log(rational_to_decimal(22n, 7n).take(10).toArray())

//console.log(int_factorial(10))
console.log(ramanujan_series_approx(2))
for (let i = 1; i < 10; i++) {
    console.log(factorial_array.length)
    let [a, b] = ramanujan_series(i);
    console.log(a, b)
    console.log(rational_to_decimal(a, b).take(i * 100).toArray())
}*/

export { sqrt_newtons_method, rational_to_decimal };