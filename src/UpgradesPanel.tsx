import { Component, createEffect, createSignal, Index, useContext, Switch, Match, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import MonteCarlo from './widgets/MonteCarlo';
import RamanujanSeries from './widgets/RamanujanSeries';
import SpigotAlgorithm from './widgets/SpigotAlgorithm';
import BinarySplitting from './widgets/BinarySplitting';

type WidgetProps = {
    addDigits: (newDigits: number[], startIndex: number) => void,
}

type Upgrade<P extends WidgetProps> = {
    name: string
    cost: number,
    unlocked: () => boolean,
    active: boolean,
    component: Component<P>,
}

type UpgradesPanelProps = {
    numDigits: number, 
    upgrades: Upgrade<any>[],
    addDigits: (newDigits: number[], startIndex: number) => void,
};

const UpgradesPanel: Component<UpgradesPanelProps> = (props) => {
    //useContext()
    const [upgrades, setUpgrades] = createStore<Upgrade<any>[]>(props.upgrades)

    onMount(() =>
    setUpgrades([
        {
            name: "Regular Polygon Bisection",
            cost: 20,
            unlocked() { return props.numDigits >= 5 },
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
            name: "Leibniz formula",
            cost: 10,
            unlocked() { return this.cost <= props.numDigits },
            active: false,
            component: () => <></>,
        },
        {
            name: "Other Method?",
            cost: 500,
            unlocked() { return props.numDigits > 100 },
            active: false,
            component: () => <></>
        },
        {
            name: "Gosper's Series with Spigot Algorithm",
            cost: 10_000,
            unlocked() {
                return props.numDigits >= 1000
            },
            active: true,
            component: SpigotAlgorithm,
        },
        {
            name: "Ramanujan Series",
            cost: 50_000,
            unlocked() {
                return props.numDigits >= 10_000
            },
            active: true,
            component: RamanujanSeries,
        },
        {
            name: "Binary Splitting Chudnovsky Series",
            cost: 50_000,
            unlocked() {
                return props.numDigits >= 10_000
            },
            active: true,
            component: BinarySplitting,
        }
    ]))

    createEffect(() => 
    setUpgrades((upgrades) => {
        console.log("Updating")
        return upgrades.toSorted((a, b) => a.cost - b.cost)
    }))

    return (
        <div class="flex flex-col gap-2">
            <h1 class="self-center text-lg py-1">Shop</h1>
            <Index each={upgrades}>
                {
                    (upgrade, index) => 
                    <button class="p-2 bg-gray-200 disabled:bg-gray-300 active:bg-gray-300 flex flex-row justify-between gap-2 items-center" 
                    disabled={!(upgrade().unlocked() && props.numDigits > upgrade().cost)}
                    onclick={() => {
                        if (props.numDigits >= upgrade().cost) {
                            setUpgrades(index, {active: true})
                        }
                    }}
                    >
                    <span>{upgrade().name}</span>
                    <div class="p-1 bg-sky-300 rounded" classList={{}}>
                        <Switch fallback={"???"}>
                            <Match when={upgrade().active}>
                                Active
                            </Match>
                            <Match when={upgrade().unlocked()}>
                                {upgrade().cost} digits
                            </Match>
                        </Switch>
                    </div>
                    </button>
                }
            </Index>
        </div>
    )
}

export default UpgradesPanel;
export { type Upgrade };