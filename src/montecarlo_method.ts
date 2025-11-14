type Point = [number, number]

// First quadrant of the unit circle
class CircleSimulation {
    points: Point[] = []
    inside: number = 0
    outside: number = 0

    constructor() {

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
        let point: Point = [Math.random(), Math.random()]

        if (point[0]**2 + point[1]**2 <= 1) {
            this.inside++;
        } else {
            this.outside++;
        }

        //this.points.push(point)
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