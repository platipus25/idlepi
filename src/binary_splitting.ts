import { memo } from "solid-js/web";
import { sqrt_newtons_method, rational_to_decimal } from "./series_expansions";


type SeriesTerms = {
    a: (k: number)=>bigint, 
    b: (k:number)=>bigint, 
    p: (j: number)=>bigint,
    q: (j: number)=>bigint,
    memoization: {[index: `${number},${number}`]: [bigint, bigint, bigint, bigint]},
}

// Evaluates \sum_{k=1}^n a(k)/b(k) \prod_{j=1}^k p(j)/q(j)
function binary_splitting_algorithm(n: number, terms: SeriesTerms) {
    const [P, Q, B, T] = sum_abpq_memoized(0, n, terms);

    const [numerator, denominator] = [T, B * Q];

    return [numerator, denominator];
}

function sum_abpq_memoized(n1: number, n2: number, terms: SeriesTerms) {
    let val = terms.memoization[`${n1},${n2}`];
    if (val !== undefined) {
        return val;
    }
    val = sum_abpq(n1, n2, terms)
    if (n2 - n1 > 1000) {
        console.log(n2, n1)
        terms.memoization[`${n1},${n2}`] = val
    }
    return val
}

function sum_abpq(n1: number, n2: number, terms: SeriesTerms): [bigint, bigint, bigint, bigint] {
    if ((n2 - n1) <= 1) {
        const [P, Q, B] = [terms.p(n1), terms.q(n1), terms.b(n1)];
        const T = terms.a(n1) * P;

        return [P, Q, B, T];
    }

    const midpoint = Math.floor((n1 + n2) / 2);

    let [P1, Q1, B1, T1] = sum_abpq_memoized(n1, midpoint, terms);
    let [P2, Q2, B2, T2] = sum_abpq_memoized(midpoint, n2, terms);

    const [P, Q, B, T] = [P1 * P2, Q1 * Q2, B1 * B2, B2 * Q2 * T1 + B1 * P1 * T2];

    return [P, Q, B, T];
}

// function sum_abpq_iterative(n: number, terms: SeriesTerms): [bigint, bigint, bigint, bigint] {
//     let call_stack: [number, number][] = []

//     call_stack.push([0, n]);

//     let val = null;
    
//     while (call_stack.length > 0) {
//         const [n1, n2] = call_stack.pop()!
//         const midpoint = Math.floor((n1 + n2) / 2);

//         if ((n2 - n1) <= 1) {
//             const [P, Q, B] = [terms.p(n1), terms.q(n1), terms.b(n1)];
//             const T = terms.a(n1) * P;

//             val = [P, Q, B, T];
//             console.log("Base", n1)
//             continue;
//         }

//         console.log(n1, n2, "add")


//         call_stack.push([midpoint, n2])
//         call_stack.push([n1, midpoint])

//     }

//     // let [P1, Q1, B1, T1] = sum_abpq(n1, midpoint, terms);
//     // let [P2, Q2, B2, T2] = sum_abpq(midpoint, n2, terms);

//     // const [P, Q, B, T] = [P1 * P2, Q1 * Q2, B1 * B2, B2 * Q2 * T1 + B1 * P1 * T2];

//     // return [P, Q, B, T];
//     return [0n, 0n, 0n, 0n];
// }
// console.log(sum_abpq_iterative(4, {a: _ => 0n, b: _ => 0n, p: n => BigInt(n), q: _ => 0n}))

function chudnovsky_series(num_chudnovsky_terms: number, num_newtons_method_terms: number, memoization: {}): Generator<bigint> {
    const A = 13591409n;
    const B = 545140134n;
    const C = 640320n;
    const chudnovsky_terms: SeriesTerms = {
        a: n => A + BigInt(n) * B,
        b: _ => 1n,
        p: k => {
            const n = BigInt(k)
            if (n === 0n) { return 1n }

            return -(6n * n - 5n) * (2n * n - 1n) * (6n * n -  1n)
        },
        q: k => {
            const n = BigInt(k)
            if (n === 0n) { return 1n }
            return n**3n * C**3n / 24n
        },
        memoization,
    }

    const [n, d] = binary_splitting_algorithm(num_chudnovsky_terms, chudnovsky_terms);

    const [n1, d1] = sqrt_newtons_method(C**3n, BigInt(Math.floor(Math.sqrt(Number(C)**3))), num_newtons_method_terms);
    //console.log(n1/ d1)
    //console.log(Math.sqrt(Number(C)**3))

    //let val = Number(d) / Number(n) * Math.sqrt(Number(C)**3) / 12;

    const [n2, d2] = [d * n1, n * d1 * 12n]

    console.log(n2.toString(2).length / 8, d2.toString(2).length / 8)

    return rational_to_decimal(n2, d2)
}

//console.log(chudnovsky_series(50, 15).take(100).toArray())

export { chudnovsky_series };