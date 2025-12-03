import { chudnovsky_series, leibniz_formula, MemoizationDict, Formula } from '../binary_splitting';
import { rational_to_decimal } from '../series_expansions';

type SplittingWorkerRequest = {
    formula: Formula,
    terms: number,
    //digits: number,
}

type SplittingWorkerResponse = {
    value: [bigint, bigint],
    //digits: number[],
}

let memoization: MemoizationDict = {}
let formula: Formula | null = null;

self.onmessage = (event: MessageEvent<SplittingWorkerRequest>) => {
    console.log(event)
    let numTerms = Math.round(event.data.terms);

    formula ??= event.data.formula;
    if (formula != event.data.formula) {
        console.error(`Sent wrong formula (${event.data.formula}) to ${formula} worker`)
        return;
    }

    let num: bigint = 0n;
    let denom: bigint = 1n;

    switch (formula) {
        case Formula.LeibnizFormula:
            [num, denom] = leibniz_formula(numTerms, memoization);
            break;
        case Formula.RamanujanFormula:
            break;
        case Formula.ChudnovskyFormula:
            [num, denom] = chudnovsky_series(numTerms, 10, memoization)
            break;
    }

    
    //let generator = rational_to_decimal(num, denom);

    //console.log(`Converting digits for ${formula}`)
    //let digits = generator.take(10).take(event.data.digits).toArray()

    let response: SplittingWorkerResponse = {
        value: [num, denom],
        //digits,
    }
    postMessage(response);
}


export type { SplittingWorkerRequest, SplittingWorkerResponse };