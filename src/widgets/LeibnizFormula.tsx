
import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import DigitCache from "../digit_cache"
import { leibniz_formula, MemoizationDict } from '../binary_splitting';
import Ticker from "../Ticker";
import katex from 'katex';
import 'katex/dist/katex.css'
import { rational_to_decimal } from "../series_expansions";
import prettyBytes from 'pretty-bytes';
import { LeibnizWorkerRequest, LeibnizWorkerResponse } from "../workers/leibniz_worker";

type LeibnizFormulaProps = {
    digitCache: DigitCache,
    addDigits: (newDigits: number[], startIndex: number) => void,
}

const LeibnizFormula: Component<LeibnizFormulaProps> = (props) => {
    let [numTerms, setNumTerms] = createSignal(1);
    let [validDigits, setValidDigits] = createSignal(1);
    let [digits, setDigits] = createSignal<number[]>([]);
    let [bytes, setBytes] = createSignal(0);
    let errorBoundEq!: HTMLElement;
    let [working, setWorking] = createSignal(false)

    const calculationWorker = new Worker(new URL("../workers/leibniz_worker.js", import.meta.url), { type: "module" });
    onCleanup(() => calculationWorker.terminate())

    createEffect(() => {
        let errorBound = 4/(2 * numTerms() + 1)
        let errorDigits = Math.ceil(Math.log10(errorBound))
        setValidDigits(1 - errorDigits)

        katex.render(
            String.raw`\left|\pi - \tilde{\pi}^{(n)}\right| \le \frac{4}{2 n + 1} \le 10^{${errorDigits}}`, 
            errorBoundEq, {throwOnError: false}
        )
    })



    const doCalculation = async (increment: number) => {
        if (working()) {
            return;
        }

        setNumTerms((i) => increment*i)

        console.log("Starting", calculationWorker)
        setWorking(true)

        let workerPromise = new Promise<LeibnizWorkerResponse>((resolve, reject) => {
            calculationWorker.postMessage({terms: Math.round(numTerms())})
            calculationWorker.onmessage = (event) => {
                resolve(event.data)
            }
        })

        let {value: [num, denom], digits: calculatedDigits} = await workerPromise;

        setWorking(false);

        setDigits(calculatedDigits.slice(0, validDigits() - 1))
        console.log(digits())

        // let bytes = 0;
        // for (let x of Object.values(memoization)) {
        //     for (let val of x) {
        //         bytes += Math.floor(val.toString(2).length / 8)
        //     }
        // }
        let bytes = Math.floor(num.toString(2).length / 8) + Math.floor(denom.toString(2).length / 8)
        setBytes(bytes)

        props.addDigits(digits(), 0)
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 class="border-b-2 text-center">Leibniz Formula</h1>
            
            <div class="overflow-scroll" ref={(elem) => {
                katex.render(String.raw`\frac{\pi}{4} = \arctan(1) = \sum_{k=0}^\infty \frac{(-1)^k}{2k + 1}`, elem, {displayMode: true, throwOnError: false})
            }} />

            <span>{digits().slice(0, validDigits() - 1).join("") + digits().slice(validDigits() - 1).join("")}</span>
            <div>
                Error Bound:
                <span class="overflow-scroll" ref={errorBoundEq}/>
            </div>
            <span>Terms: {numTerms()}</span>
            <span>Memory (final result): {prettyBytes(bytes())}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={() => doCalculation(2)}></Ticker>
                <button class="btn" disabled={working()} onclick={() => doCalculation(2)}>x2</button>
            </div>
        </div>
    )
};

export default LeibnizFormula;