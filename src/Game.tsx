import { Component, createSignal, createMemo, For, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Motion, createMotion } from 'solid-motionone';
import "./Game.css"
import UpgradesPanel from './UpgradesPanel';
import { Upgrade } from './UpgradesPanel';
import MonteCarlo from './MonteCarlo';
import DigitCache from "./digit_cache";

type GameState = {
    digits: number[], numDigits: number, upgrades: Upgrade[]
}


const Game: Component = () => {
    const [state, setState] = createStore<GameState>({
        digits: [3, 1, 4],
        numDigits: 0,
        upgrades: [],
    })

    const digitCache = new DigitCache()

    createEffect(() => {
        setState("numDigits", state.digits.length)
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

    const [tickTimer, setTickTimer] = createSignal<NodeJS.Timer | undefined>()
    const setRunning = (isRunning: boolean) => {
        if (isRunning) {
            setTickTimer(setInterval(() => {
                digitsBatched(11)
            }, 10))
        } else {
            clearInterval(tickTimer())
            setTickTimer(undefined)
        }
    }

  return (
    <div class="grid lg:grid-cols-3 font-mono gap-10 p-2">

        <div class="lg:order-0 order-1">
            <UpgradesPanel addDigits={addDigitsUnchecked} upgrades={state.upgrades} numDigits={state.numDigits}></UpgradesPanel>
        </div>

        <div class="flex flex-col items-center min-w-0">
            <PiDisplay state={state}></PiDisplay>

            <button onclick={() => digitsBatched(10)}>+10</button>

            <div class="flex gap-1.5">
                <input type="checkbox" checked={tickTimer() !== undefined} onchange={(e) => setRunning(e.currentTarget.checked)}/> 
                <label>Run</label>
            </div>

            <NumberInput addDigit={addDigit} />
        </div>

        <div class="flex flex-col gap-2">
            <For each={state.upgrades}>
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
                    <button class="bg-gray-300 p-1 aspect-square" onclick={() => props.addDigit(item, badDigit)}>
                        {item}
                    </button>
                
            }
        </For>
        </Motion.div>
    )
}

export default Game;