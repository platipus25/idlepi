
import { Component, createSignal, onCleanup } from "solid-js";
import { CircleSimulation } from './montecarlo_method';
import DigitCache from "./digit_cache"

type MonteCarloProps = {
    digitCache: DigitCache,
}

const MonteCarlo: Component<MonteCarloProps> = (props) => {
    let sim = new CircleSimulation();
    const [numThrown, setNumThrown] = createSignal(0);
    const [approx, setApprox] = createSignal(0);

    const tick = () => {
        for (let i = 0; i < 1_000_000; i ++) {
            sim.addPoint()
        }            
        setNumThrown(() => sim.inside + sim.outside)
        setApprox(sim.estimate())

        //console.log("Ticking", sim)
    }



    const interval = setInterval(() => {
        tick()
    }, 0);
    onCleanup(() => clearInterval(interval));

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 onclick={tick} class="border-b-2">Dart Thrower 9000</h1>
            <span>Darts: {numThrown()}</span>
            <span class="self-center">{approx().toFixed(10)}</span>
            <button onclick={() => sim = new CircleSimulation()}>Reset</button>
        </div>
    )
};

export default MonteCarlo;