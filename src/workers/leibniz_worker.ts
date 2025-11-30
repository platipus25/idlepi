import { leibniz_formula, MemoizationDict } from '../binary_splitting';
import { rational_to_decimal } from '../series_expansions';

type LeibnizWorkerRequest = {
    terms: number,
}

type LeibnizWorkerResponse = {
    value: [bigint, bigint],
    digits: number[],
}

let memoization: MemoizationDict = {}

self.onmessage = (event: MessageEvent<LeibnizWorkerRequest>) => {
    console.log(event)

    let [num, denom] = leibniz_formula(Math.round(event.data.terms), memoization);
    
    let generator = rational_to_decimal(num, denom);
    let digits = generator.take(20).toArray()

    let response: LeibnizWorkerResponse = {
        value: [num, denom],
        digits,
    }
    postMessage(response);
}


export type { LeibnizWorkerRequest, LeibnizWorkerResponse };