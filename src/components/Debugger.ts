import { EventEmitter } from "stream";
import { Building } from "./Building";
import { FLOOR_EVENT, LIFT_EVENT, LIFT_STATE } from "../constant/constant";

const FUNCTIONS = {
    DISPLAY_ALL_LIFT_STATE: false,
}

export class Debugger {
    building: Building;
    eventEmitter: EventEmitter;
    constructor(building: Building, eventEmitter: EventEmitter) {
        this.building = building;
        this.eventEmitter = eventEmitter;
    }

    printStateOnEvent() {
        Object.values(LIFT_EVENT).forEach(event => {
            this.eventEmitter.on(event, (position) => {
                console.log(`---- ${event} by ${position} Lift ----`)
                const lift = this.building.getLift(position);
                
                if (FUNCTIONS.DISPLAY_ALL_LIFT_STATE) {
                    this.building.lifts.forEach((liftState, index) => {
                        console.log(`Lift ${index}: `, liftState)
                    })
                } else {
                    console.log(`Lift ${position}: `, lift)
                }
            })
        })

        Object.values(FLOOR_EVENT).forEach(event => {
            this.eventEmitter.on(event, (position) => {
                console.log(`---- ${event} by ${position} Floor ----`)
                const floor = this.building.floors[position];
                console.log(`Floor ${position}: `, floor)
            })
        })
    }
}