import { Component, createSignal, createMemo, For, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Motion, createMotion } from 'solid-motionone';
import "./Game.css"
import {rabinowitz_wagon_streaming, gosper_series_streaming} from "./spigot_algorithm"

class DigitCache {
    pi_generator: Generator<[number, bigint]>
    cached_digits: number[] = []

    constructor() {
        this.pi_generator = gosper_series_streaming()
    }

    calculateToDigit(place: number) {
        while (this.cached_digits.length <= place) {
            let {value, done} = this.pi_generator.next()
            let [index, digit] = value
            //console.assert(this.cached_digits.length == index, "generator and cache should be in sync")
            this.cached_digits.push(digit)
        }
        return this.cached_digits.at(place)
    }
}

const Game: Component = () => {
    const [state, setState] = createStore({
        digits: [3, 1, 4],
        numDigits: 0,
    })
    const digitsString = createMemo(() => {
        let first_few = state.digits.slice(1, 10).join("")

        let rest = "..." + state.digits.slice(10).slice(-30).join("")
        
        return state.digits.at(0) + "." + first_few + ((state.digits.length > 10)?rest:"")
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
    <div class="flex items-center flex-col font-mono">
        <h1 class="text-4xl text-center py-20">{digitsString()}</h1>
            
        <h1>{state.numDigits}</h1>

        <button onclick={() => digitsBatched(10)}>+10</button>

        <button onclick={() => 
        setInterval(() => {
            digitsBatched(11)
        }, 10)}>Run</button>

        <NumberInput addDigit={addDigit} />
    </div>
  );
};

function NumberInput(props) {

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
                    <button class="bg-gray-300 p-1 aspect-square w-full" onclick={() => props.addDigit(item, badDigit)}>
                        {item}
                    </button>
                
            }
        </For>
        </Motion.div>
    )
}

export default Game;