
import { Accessor, Component, createEffect, createSignal, mergeProps, onCleanup, Setter } from "solid-js";
import BinarySplitting, { BinarySplittingProps } from "./BinarySplitting";
import { Formula } from "../binary_splitting";


const ChudnovskyFormula: Component<{ 
    addDigits: (newDigits: number[], startIndex: number) => void 
}> = (props) => {
    const binarySplittingProps: BinarySplittingProps = mergeProps({
        title: "Chudnovsky Formula",
        formula: Formula.ChudnovskyFormula,
        formulaString: String.raw`\frac{1}{\pi} = 12 \sum_{k=0}^\infty \frac{(-1)^k (6 k)! (545140134k + 13591409)}{(3k)!(k!)^3 (640320)^(3k + 3/2)}`,
        errorBound: (numTerms: Accessor<number>, setValidDigits: Setter<number>) => {
            //12/(640320 / 12) ** (3 * (numTerms() +1)) / Math.sqrt(numTerms() + 1)
            // 10^x = 10^(53360 * -3n)
            // 10^(53360 * log10(-3n))
            let logError = Math.ceil(-3 * numTerms() * Math.log10(53360))
            setValidDigits(-logError)
            return String.raw`\left|\pi - \tilde{\pi}^{(n)}\right| \le \left| s_{n+1} \right| \le \frac{53360^{-3(n+1)}}{\sqrt{n + 1}} \le 10^{${logError}}`
        },
    }, props)

    return <BinarySplitting {...binarySplittingProps}/>
}
/*
const BinarySplitting2: Component<BinarySplittingProps> = (props) => {
    let [numDigits, setNumDigits] = createSignal(1);
    let [calculating, setCalculating] = createSignal(false);
    let memoization = {}

    // const series = chudnovsky_series()

    const doCalculation = (increment: number) => {
        if (calculating()) {
            console.log("Nope!")
            return;
        }

        setNumDigits((i) => increment * i)
        setCalculating(true);
        console.log("Starting")
        let [numerator, denominator] = chudnovsky_series(numDigits(), 10, memoization);
        let generator = rational_to_decimal(numerator, denominator);
        let digits = generator.take(10).toArray()
        console.log(digits)
        console.log(memoization)
        //console.log(chudnovsky_series(90000, 10).take(10).toArray())

        setCalculating(false);
        //props.addDigits(Array.from(result), 0)
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 class="border-b-2 text-center">Chudnovsky Series with Binary Splitting</h1>
            <div class="overflow-scroll" ref={(elem) => {
                katex.render(, elem, {displayMode: true, throwOnError: false})
            }} />
            <span>{calculating()? "Calculating": ""}</span>
            <span>{numDigits()}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={() => doCalculation(1000)}></Ticker>
                <button class="btn" onclick={() => doCalculation(2)}>x2</button>
            </div>
        </div>
    )
};
*/

export default ChudnovskyFormula;