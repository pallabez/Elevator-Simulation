import { EventEmitter } from "stream";
import { Building } from "./Building";
import { FLOOR_EVENT, LIFT_EVENT, LIFT_STATE } from "../constant/constant";

export class Debugger {
    building: Building;
    eventEmitter: EventEmitter;

    constructor(building: Building, eventEmitter: EventEmitter) {
        this.building = building;
        this.eventEmitter = eventEmitter;
    }

    printStateOnEvent() {
        let allEvents = Object.keys({ ...LIFT_EVENT, ...FLOOR_EVENT })

        allEvents.forEach(event => {
            this.eventEmitter.on(event, () => {
                console.log(`----${event}----`)
                this.building.lifts.forEach((liftState, index) => {
                    console.log(`Lift ${index}: `, liftState)
                })
            })   
        })
    }
}