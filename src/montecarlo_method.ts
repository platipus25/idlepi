type Point = [number, number]

// First quadrant of the unit circle
class CircleSimulation {
    inside: number = 0
    outside: number = 0
    radius: number

    constructor() {
        this.radius = 1
    }

    get total() {
        return this.inside + this.outside
    }

    estimate() {
        return 4 * this.inside / this.total
    }

    digits() {
        this.estimate()
    }

    addPoint() {
        let point: Point = [this.radius * Math.random(), this.radius* Math.random()]

        if (point[0]**2 + point[1]**2 <= this.radius**2) {
            this.inside++;
        } else {
            this.outside++;
        }
    }
}

/*let sim = new CircleSimulation()
for (let i = 0; i < 10_000_000_000; i++) {
    sim.addPoint()
    if (i % 10_000_000 == 0 ) {
        console.log(sim.estimate())
    }
}*/

export { CircleSimulation };