
import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import DigitCache from "../digit_cache"
import { get_ramanujan_series, ramanujan_series_digits } from "../../picalculation/pkg/picalculation";
import Ticker from "../Ticker";


type RamanujanSeriesProps = {
    digitCache: DigitCache,
    addDigits: (newDigits: number[], startIndex: number) => void,
}

const RamanujanSeries: Component<RamanujanSeriesProps> = (props) => {
    let [numDigits, setNumDigits] = createSignal(0);
    let [calculating, setCalculating] = createSignal(false);

    const series = get_ramanujan_series()

    const doCalculation = (increment: number) => {
        if (calculating()) {
            console.log("Nope!")
            return;
        }
        setCalculating(true);
        let result = ramanujan_series_digits(series, BigInt(numDigits() + increment));
        setCalculating(false);
        setNumDigits(result.length)
        props.addDigits(Array.from(result), 0)
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 class="border-b-2 text-center">Ramanujan Series</h1>
            <span>{calculating()? "Calculating": ""}</span>
            <span>{numDigits()}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={() => doCalculation(111)}></Ticker>
                <button class="btn" onclick={() => doCalculation(100)}>+100</button>
            </div>
        </div>
    )
};

export default RamanujanSeries;