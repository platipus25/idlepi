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

export default DigitCache;