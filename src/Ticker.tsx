import { Component, createSignal } from "solid-js";

const Ticker: Component<{ tick: () => void}> = (props) => {
    const [tickTimer, setTickTimer] = createSignal<NodeJS.Timer | undefined>();

    const setEnabled = (enable: boolean) => {
        if (enable) {
                setTickTimer(setInterval(props.tick, 10))
            } else {
                clearInterval(tickTimer())
                setTickTimer(undefined)
            }
    }

    return (
    <div class="flex gap-1.5">
        <input type="checkbox" checked={tickTimer() !== undefined} onchange={(e) => {
            setEnabled(e.currentTarget.checked)
        }}/> 
        <label>Run</label>
    </div>
    )
}

export default Ticker;