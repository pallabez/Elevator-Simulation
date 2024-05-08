import { EventEmitter } from "events";
import { FLOOR_EVENT, LIFT_EVENT, LIFT_STATE } from "../constant/constant";
import { Building } from "./Building";
import { Floor } from "./Floor";
import { Lift } from "./Lift";

export class Engine {
  lifts: Array<Lift>;
  floors: Array<Floor>;
  building: Building;
  queue: Array<number>;
  eventEmitter: EventEmitter;

  constructor(building: Building, eventEmitter: EventEmitter) {
    this.building = building;
    this.lifts = building.lifts;
    this.floors = building.floors;
    this.queue = [];
    this.eventEmitter = eventEmitter;

    eventEmitter.on(FLOOR_EVENT.FLOOR_BUTTON_UP_CLICK, (floor) => {
      this.requestLiftToFloor(floor * 1000);
    })

    eventEmitter.on(FLOOR_EVENT.FLOOR_BUTTON_DOWN_CLICK, (floor) => {
      this.requestLiftToFloor(floor * 1000);
    })

    eventEmitter.on(LIFT_EVENT.IS_IDLE, () => {
      if(this.queue.length === 0) return;

      this.requestLiftToFloor(this.queue.shift());
    })
  }

  requestLiftToFloor(floor: number) {
    const staleLift = this.findOptimalLiftForFloor(floor);
    if(!staleLift) return this.queue.push(floor);

    staleLift.moveToFloor(floor);
  }

  findOptimalLiftForFloor(floor: number): Lift | null {
    if(!this.lifts) return null;

    const staleLift = this.lifts.find(lift => lift.getLiftState().state === LIFT_STATE.CLOSED);
    if (staleLift) return staleLift;
  }
}
