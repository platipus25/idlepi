
import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import DigitCache from "../digit_cache"
import { chudnovsky_series } from '../binary_splitting';
import Ticker from "../Ticker";
import katex from 'katex';
import 'katex/dist/katex.css'


type BinarySplittingProps = {
    digitCache: DigitCache,
    addDigits: (newDigits: number[], startIndex: number) => void,
}

const BinarySplitting: Component<BinarySplittingProps> = (props) => {
    let [numDigits, setNumDigits] = createSignal(90_000);
    let [calculating, setCalculating] = createSignal(false);
    let memoization = {}

    // const series = chudnovsky_series()

    const doCalculation = (increment: number) => {
        if (calculating()) {
            console.log("Nope!")
            return;
        }
        setCalculating(true);
        console.log("Starting")
        let digits = chudnovsky_series(numDigits(), 10, memoization);
        console.log(digits.take(10).toArray())
        console.log(memoization)
        //console.log(chudnovsky_series(90000, 10).take(10).toArray())

        setCalculating(false);
        setNumDigits((i) => 2*i)
        //props.addDigits(Array.from(result), 0)
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 class="border-b-2 text-center">Chudnovsky Series with Binary Splitting</h1>
            <div class="overflow-scroll" ref={(elem) => {
                katex.render(String.raw`\frac{1}{\pi} = 12 \sum_{k=0}^\infty \frac{(-1)^k (6 k)! (545140134k + 13591409)}{(3k)!(k!)^3 (640320)^(3k + 3/2)}`, elem, {displayMode: true, throwOnError: false})
            }} />
            <span>{calculating()? "Calculating": ""}</span>
            <span>{numDigits()}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={() => doCalculation(111)}></Ticker>
                <button class="btn" onclick={() => doCalculation(100)}>+100</button>
            </div>
        </div>
    )
};

export default BinarySplitting;