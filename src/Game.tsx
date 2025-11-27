import { Component, createSignal, createMemo, For, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Motion, createMotion } from 'solid-motionone';
import "./Game.css"
import UpgradesPanel from './UpgradesPanel';
import { Upgrade } from './UpgradesPanel';
import DigitCache from "./digit_cache";

import Ticker from './Ticker';

type GameState = {
    digits: number[],
    numDigits: number, 
    digitRate: number,
    upgrades: Upgrade<any>[],
}


const Game: Component = () => {
    const [state, setState] = createStore<GameState>({
        digits: [3, 1, 4],
        numDigits: 0,
        digitRate: 0,
        upgrades: [],
    })

    const digitCache = new DigitCache()

    let digitTimingFilter: [DOMHighResTimeStamp, number][] = []

    createEffect(() => {
        const now = performance.now()
        digitTimingFilter.push([now, state.digits.length])
        digitTimingFilter = digitTimingFilter.filter(([t, _]) => Math.abs(t - now) < 3000)
        let end = digitTimingFilter.at(-1)
        let start = digitTimingFilter.at(0)
        let slope = 0;
        if (start !== undefined && end !== undefined) {
            console.log(start, end)
            slope = (start[1] - end[1]) / (start[0] - end[0]) || 0
        }
        console.log(digitTimingFilter.length)
        setState({digitRate: slope, numDigits: state.digits.length})
    })
    
    const addDigit = (digit: number, badDigit: Function) => {
        const place = state.digits.length
        let calculatedDigit = Number(digitCache.calculateToDigit(place))
        if (digit === calculatedDigit) {
            setState("digits", state.digits.length, digit)
        } else {
            badDigit(digit, calculatedDigit)
        }
    }

    const addDigitsUnchecked = (newDigits: number[], startIndex: number) => {
        // We don't check the validity of the digits

        if (startIndex > newDigits.length + 1) {
            throw new Error("can't add these digits because it would leave a gap")
        }

        setState(
            "digits",
            (digits) => {
                return [
                ...digits,
                ...newDigits.slice(digits.length - startIndex)
            ]
            }
        )
    }

    const digitsBatched = (num: number) => {
        const start = state.digits.length
        const end = start + num;
        digitCache.calculateToDigit(end)

        setState(
            "digits",
            (digits) => [
                ...digits,
                ...digitCache.cached_digits.slice(start, end),
            ]
        )
    }

  return (
    <div class="grid lg:grid-cols-3 font-mono gap-10 p-2">

        <div class="lg:order-0 order-1">
            <UpgradesPanel addDigits={addDigitsUnchecked} upgrades={state.upgrades} numDigits={state.numDigits}></UpgradesPanel>
        </div>

        <div class="flex flex-col items-center min-w-0">
            <PiDisplay state={state}></PiDisplay>

            <span>{(state.digitRate * 1000).toFixed(2)} digits/second</span>

            <button onclick={() => digitsBatched(10)}>+10</button>

            <Ticker tick={() => digitsBatched(11)}></Ticker>

            <NumberInput addDigit={addDigit} />
        </div>

        <div class="flex flex-col gap-2">
            <h1 class="self-center text-lg py-1">Algorithms</h1>
            <For each={state.upgrades.filter((u) => u.active)} fallback={<span class="self-center">Buy some in the shop!</span>}>
                {
                    (upgrade: Upgrade<any>, index) => <Show when={upgrade.active}>
                        {upgrade.component({ addDigits: addDigitsUnchecked })}
                    </Show>
                }
            </For>
            {/*<MonteCarlo digitCache={digitCache}></MonteCarlo>*/}
        </div>
    </div>
  );
};

function PiDisplay(props: {state: {digits: number[], numDigits: number}}) {
    let restElement!: HTMLSpanElement;

    const cutoffPoint = 6

    const firstDigits = createMemo(() => {
        let first_few = props.state.digits.slice(1, cutoffPoint).join("")
        
        return props.state.digits.at(0) + "." + first_few
    })

    const lastDigits = createMemo(() => {
        if (restElement != undefined && restElement.scrollWidth > restElement.clientWidth) {
            // Has been clipped
            return props.state.digits.slice(cutoffPoint).slice(-100).join("")
        }
        return props.state.digits.slice(cutoffPoint).join("")
    })

    return (
        <div class="flex flex-col items-center py-20 max-w-full">
            <div class="text-4xl py-2 max-w-full flex">
                <span class="block">{firstDigits()}</span>
                <span ref={restElement} dir="rtl" class="text-ellipsis overflow-hidden block whitespace-nowrap">{lastDigits()}</span>
            </div>
                
            <h1>{props.state.numDigits} digits</h1>
        </div>
    )
}

function NumberInput(props: {addDigit: Function}) {

    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    const [digitWarning, setDigitWarning] = createSignal(false)

    const badDigit = (user: number, real: number) => {
        console.log(user, real)
        console.log("bad")
        setDigitWarning(true)
        setTimeout(() => setDigitWarning(false), 400)
    }

    return (
        <Motion.div class="flex items-strtch gap-1" classList={{"animate-wiggle": digitWarning()}}>
        <For each={numbers}>
            {
                (item, index) => 
                    <button class="btn aspect-square" onclick={() => props.addDigit(item, badDigit)}>
                        {item}
                    </button>
                
            }
        </For>
        </Motion.div>
    )
}

export default Game;