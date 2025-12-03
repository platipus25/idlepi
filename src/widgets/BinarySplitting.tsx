
import { Accessor, Setter, Component, createEffect, createSignal, onCleanup, createMemo } from "solid-js";
import Ticker from "../Ticker";
import katex from 'katex';
import 'katex/dist/katex.css'
import prettyBytes from 'pretty-bytes';
import { SplittingWorkerRequest, SplittingWorkerResponse } from "../workers/binary_splitting_worker";
import { Formula } from "../binary_splitting";
import { rational_to_decimal, skip_digits } from "../series_expansions";

type BinarySplittingProps = {
    title: string,
    formulaString: string,
    formula: Formula,
    errorBound: (numTerms: Accessor<number>, setValidDigits: Setter<number>) => string
    addDigits: (newDigits: number[], startIndex: number) => void,
}

const BinarySplitting: Component<BinarySplittingProps> = (props) => {
    let [numTerms, setNumTerms] = createSignal(1);
    let [validDigits, setValidDigits] = createSignal(1);

    let [digits, setDigits] = createSignal<number[]>([]);
    let [generator, setGenerator] = createSignal<Generator<number>>()

    let [bytes, setBytes] = createSignal(0);
    let errorBoundEq!: HTMLElement;
    let [working, setWorking] = createSignal(false)

    const calculationWorker = new Worker(new URL("../workers/binary_splitting_worker.js", import.meta.url), { type: "module" });
    onCleanup(() => calculationWorker.terminate())

    const errorBoundMemo = createMemo(() => props.errorBound(numTerms, setValidDigits))

    createEffect(() => {
        katex.render(
            errorBoundMemo(), 
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

        let workerPromise = new Promise<SplittingWorkerResponse>((resolve, reject) => {
            let request: SplittingWorkerRequest = {
                formula: props.formula,
                terms: Math.round(numTerms())
            }
            calculationWorker.postMessage(request)
            calculationWorker.onmessage = (event) => {
                resolve(event.data)
            }
        })

        let {value: [num, denom]} = await workerPromise;

        setWorking(false);

        setDigits([])
        let [n, d] = skip_digits(num, denom, 0);
        setGenerator(rational_to_decimal(n, d))

        let bytes = Math.floor(num.toString(2).length / 8) + Math.floor(denom.toString(2).length / 8)
        setBytes(bytes)
    }

    const doConvert = (number: number) => {
        if (digits().length >= validDigits()) {
            return;
        }

        for (let i = 0; i < number; i++) {
            let { value, done } = generator()?.next() ?? {done: true};
            if (done) {
                break;
            }
            console.log("converting (:")
            setDigits((digits) => [...digits, value])
        }

        props.addDigits(digits(), 0)
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 class="border-b-2 text-center">{props.title}</h1>
            
            <div class="overflow-scroll" ref={(elem) => {
                katex.render(props.formulaString, elem, {displayMode: true, throwOnError: false})
            }} />

            {/*<span>{digits().slice(0, validDigits() - 1).join("") + digits().slice(validDigits() - 1).join("")}</span>*/}
            <div>
                Error Bound:
                <span class="overflow-scroll" ref={errorBoundEq}/>
            </div>
            <span>Terms: {numTerms()}</span>
            <span>Digits: {validDigits()}</span>
            <span>Memory (final result): {prettyBytes(bytes())}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={() => doCalculation(2)}></Ticker>
                <Ticker tick={() => doConvert(100)} startEnabled={true}>Convert</Ticker>
                <button class="btn" disabled={working()} onclick={() => doCalculation(2)}>x2</button>
            </div>
        </div>
    )
};

export default BinarySplitting;
export type { BinarySplittingProps };