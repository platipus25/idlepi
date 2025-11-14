import { Component, createEffect, createSignal, For, useContext, Switch, Match, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import MonteCarlo from './MonteCarlo';

type Upgrade = {
    name: string
    cost: number,
    unlocked: () => boolean,
    active: boolean,
    component: Component<any>,
}

const UpgradesPanel: Component<{numDigits: number, upgrades: Upgrade[]}> = (props) => {
    //useContext()
    const [upgrades, setUpgrades] = createStore<Upgrade[]>(props.upgrades)

    onMount(() =>
    setUpgrades([
        {
            name: "Regular Polygon Bisection",
            cost: 20,
            unlocked() { return this.cost <= props.numDigits },
            active: false,
            component: () => <>Regular Polygon Bisection</>,
        },
        {
            name: "Monte Carlo Method",
            cost: 5,
            unlocked() { return this.cost <= props.numDigits },
            active: false,
            component: MonteCarlo,
        },
        {
            name: "Other Method?",
            cost: 500,
            unlocked() { return this.cost <= props.numDigits },
            active: false,
            component: () => <></>
        },
        {
            name: "Spigot Algorithm",
            cost: 100_000,
            unlocked() {
                return props.numDigits > 1000
            },
            active: false,
            component: () => <></>,
        }
    ]))

    setUpgrades((upgrades) => {
        console.log("Updating")
        return upgrades.toSorted((a, b) => a.cost - b.cost)
    })

    return (
        <div class="flex flex-col gap-2">
            <h1 class="self-center text-lg py-1">Shop</h1>
            <For each={upgrades}>
                {
                    (upgrade, index) => 
                    <button class="p-2 bg-gray-200 active:bg-gray-300 flex flex-row justify-between gap-2 items-center" 
                    classList={{"bg-gray-300": !upgrade.unlocked()}} 
                    disabled={!upgrade.unlocked()}
                    onclick={() => {
                        if (props.numDigits > upgrade.cost) {
                            setUpgrades(index(), {active: true})
                        }
                    }}
                    >
                    <span>{upgrade.name}</span>
                    <div class="p-1 bg-sky-300 rounded">
                        <Switch fallback={"???"}>
                            <Match when={upgrade.active}>
                                Active
                            </Match>
                            <Match when={upgrade.unlocked()}>
                                {upgrade.cost} digits
                            </Match>
                        </Switch>
                    </div>
                    </button>
                }
            </For>
        </div>
    )
}

export default UpgradesPanel;
export { type Upgrade };