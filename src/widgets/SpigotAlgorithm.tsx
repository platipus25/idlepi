
import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import DigitCache from "../digit_cache"
import Ticker from "../Ticker";
import { get_gosper_series, gosper_stream } from "../../picalculation/pkg/picalculation";
import katex from "katex";
import "katex/dist/katex.css"

type SpigotProps = {
    digitCache: DigitCache,
    addDigits: (newDigits: number[], startIndex: number) => void,
}

const SpigotAlgorithm: Component<SpigotProps> = (props) => {
    let [numDigits, setNumDigits] = createSignal(0);
    let series = get_gosper_series();
    let digits: number[] = []

    const doCalculation = (num: number) => {
        let calculatedDigits = Array.from(gosper_stream(series, num));
        setNumDigits((x) => x+ calculatedDigits.length);
        digits = digits.concat(calculatedDigits);
        props.addDigits(digits, numDigits())
        //setNumDigits(result.length)
        //props.addDigits(Array.from(result), 0)
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 class="border-b-2 text-center">Spigot Algorithm</h1>
            <div class="overflow-scroll" ref={(elem) => {
                katex.render(String.raw`
                    3 + \frac{1 \times 1}{3 \times 4 \times 5} \times \left(8 + \frac{2 \times 3}{3 \times 7 \times 8} \times \left(\cdots 5i - 2 + \frac{i (2 i - 1)}{3 (3i + 1)(3 i +2)}\times \cdots \right)\right)
                    `, elem, {displayMode: true, throwOnError: false})
            }} />

            <span>{numDigits()}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={() => doCalculation(100)}></Ticker>
                <button class="btn" onclick={() => doCalculation(100)}>+100</button>
            </div>
        </div>
    )
};

export default SpigotAlgorithm;