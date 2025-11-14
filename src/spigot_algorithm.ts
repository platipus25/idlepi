
type Lft = [bigint, bigint, bigint, bigint] 

function extr(transformation: Lft, x: bigint) {
    const [q, r, s, t] = transformation;
    //console.log((q * x + r), (s * x + t))
    return ((q * x + r) / (s * x + t))
}

const comp = ([q, r, s, t]: Lft, [u, v, w, x]: Lft): Lft => [q*u+r*w, q*v+r*x, s*u+t*w, s*v+t*x]


/*
Algorithm adapted from Unbounded Spigot Algorithms for the Digits of Pi by Jeremy Gibbons.
@article{cite-key,
	author = {Gibbons, Jeremy},
	journal = {The American Mathematical Monthly},
	number = {4},
	pages = {318-328},
	title = {Unbounded Spigot Algorithms for the Digits of Pi},
	volume = {113},
	year = {2006}
}
*/
function *rabinowitz_wagon_streaming(): Generator<[number, bigint]> {
    // The unit Möbius transformation
    let state: Lft = [1n, 0n, 0n, 1n]
    function *transformation_terms(): Generator<Lft> {
        for (let k = 1n;; k++) {
            yield [k, 4n*k+2n, 0n, 2n*k+1n]
        }
    }
    let terms = transformation_terms()
    let place = 0;

    while (true) {
        const next_digit = extr(state, 3n); // next state

        const safe = next_digit === extr(state, 4n);

        //console.log(safe, state)

        if (safe) {
            // produce
            state = comp([10n, -10n * next_digit, 0n, 1n], state)
            yield [place++, next_digit]
        } else {
            // consume
            const {value: next_transform, done} = terms.next()
            if (done) {
                break;
            }
            state = comp(state, next_transform)
        }
    }
}

// Also from that same paper
function *gosper_series_streaming(): Generator<[number, bigint], void> {
    let [q, r, t, i] = [1n, 180n, 60n, 2n];

    while (true) {
        const u = 3n*(3n*i+1n)*(3n*i+2n);
        const y = (q*(27n*i-12n)+5n*r) / (5n*t)

        yield [Number(i-2n), y]

        const [new_q, new_r, new_t, new_i] = [10n*q*i*(2n*i-1n), 10n*u*(q*(5n*i-2n)+ r - y*t), t*u, i+1n]
        q = new_q
        r = new_r
        t = new_t
        i = new_i
    }
}

function g(q: bigint, r: bigint, t: bigint, i: bigint): bigint[] {
    let u = 3n*(3n*i+1n)*(3n*i+2n);
    let y = (q*(27n*i-12n)+5n*r) / (5n*t)

    if (i > 10) return []

    return [y, ...g(10n*q*i*(2n*i-1n),10n*u*(q*(5n*i-2n)+r-y*t),t*u,i+1n)]
}

console.log(g(1n, 180n, 60n, 2n))

/*let stream = gosper_series_streaming().take(33_000)//rabinowitz_wagon_streaming(100)
for (let digit of stream) {
    console.log(digit)
}*/

export default rabinowitz_wagon_streaming
export { gosper_series_streaming, rabinowitz_wagon_streaming }