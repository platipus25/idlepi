import { children, Component, createSignal, onCleanup } from "solid-js";
import type { JSX, ResolvedChildren } from "solid-js"

const Ticker: Component<{ tick: () => void, startEnabled?: boolean, children?: JSX.Element }> = (props) => {
    const [tickTimer, setTickTimer] = createSignal<NodeJS.Timer | undefined>();
    
    onCleanup(() => {
        clearInterval(tickTimer())
        setTickTimer(undefined)
    })

    const setEnabled = (enable: boolean) => {
        if (enable) {
                setTickTimer(setInterval(props.tick, 10))
            } else {
                clearInterval(tickTimer())
                setTickTimer(undefined)
            }
    }
    
    if (props.startEnabled) {
        setEnabled(true)
    }

    const resolved = children(() => props.children || "Run")

    return (
    <div class="flex gap-1.5">
        <input type="checkbox" checked={tickTimer() !== undefined} onchange={(e) => {
            setEnabled(e.currentTarget.checked)
        }}/> 
        <label>{resolved()}</label>
    </div>
    )
}

export default Ticker;