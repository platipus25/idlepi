
import { Component, createSignal, onCleanup, createEffect, onMount } from "solid-js";
import { CircleSimulation } from '../montecarlo_method';
import DigitCache from "../digit_cache"
import Ticker from "../Ticker";

type MonteCarloProps = {
    digitCache: DigitCache,
}

const MonteCarlo: Component<MonteCarloProps> = (props) => {
    const [sim, setSim] = createSignal(new CircleSimulation());
    const [numThrown, setNumThrown] = createSignal(0);
    const [approx, setApprox] = createSignal(0);
    let canvasElement!: HTMLCanvasElement;

    onMount(() => {
        clearCanvas()
    })

    const clearCanvas = () => {
        const ctx = canvasElement.getContext("2d");
        if (ctx === null) {
            return;
        }
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        ctx.beginPath();
        ctx.arc(0, 100, 100, 0, 90, true)
        ctx.stroke()
        ctx.beginPath()
    }

    const tick = () => {
        for (let i = 0; i < 1_000_000; i ++) {
            sim().addPoint()
        }
        setNumThrown(() => sim().inside + sim().outside)
        setApprox(sim().estimate())
        //console.log("Ticking", sim)
        drawCanvas(canvasElement);
    }

    const drawCanvas = (canvas: HTMLCanvasElement) => {
        const ctx = canvasElement.getContext("2d");
        if (ctx === null) {
            return;
        }

        let [x, y] = [100*Math.random(), 100*Math.random()]
        ctx.fillStyle = x**2 + y**2 < 100**2? "red": "blue";
        ctx.fillRect(x, 100-y, 2, 2);
    }

    return (
        <div class="flex flex-col border-2 p-2">
            <h1 onclick={tick} class="border-b-2 text-center">Dart Thrower 9000</h1>
            <span>Darts: {numThrown()}</span>
            <canvas width={100} height={100} class="size-fit self-center" ref={canvasElement} />
            <span class="self-center">{approx().toFixed(10)}</span>
            <div class="flex flex-row justify-between items-center">
                <Ticker tick={tick}></Ticker>
                <button class="btn" onclick={() => {
                    setSim(new CircleSimulation())
                    clearCanvas()
                }}>Reset</button>
            </div>
        </div>
    )
};

export default MonteCarlo;