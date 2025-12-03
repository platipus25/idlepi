import { Accessor, Component, mergeProps, Setter } from "solid-js";
import BinarySplitting from "./BinarySplitting";
import { BinarySplittingProps } from "./BinarySplitting";
import { Formula } from "../binary_splitting";

const LeibnizFormula: Component<{ 
    addDigits: (newDigits: number[], startIndex: number) => void 
}> = (props) => {
    const binarySplittingProps: BinarySplittingProps = mergeProps({
        title: "Leibniz Formula",
        formula: Formula.LeibnizFormula,
        formulaString: String.raw`\frac{\pi}{4} = \arctan(1) = \sum_{k=0}^\infty \frac{(-1)^k}{2k + 1}`,
        errorBound: (numTerms: Accessor<number>, setValidDigits: Setter<number>) => {
            let errorBound = 4/(2 * numTerms() + 1)
            let errorDigits = Math.ceil(Math.log10(errorBound))
            setValidDigits(-errorDigits)
            return String.raw`\left|\pi - \tilde{\pi}^{(n)}\right| \le \frac{4}{2 n + 1} \le 10^{${errorDigits}}`
        },
    }, props)

    return <BinarySplitting {...binarySplittingProps}/>
}

export default LeibnizFormula;