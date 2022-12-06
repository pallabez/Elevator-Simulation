import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { Building } from "./Building";
import { Floor } from "./Floor";
import { Lift } from "./Lift";

export class Engine {
  lifts: Array<Lift>
  floors: Array<Floor>
  building: Building;
  queue: Array<number>

  constructor(building: Building) {
    this.building = building;
    this.lifts = building.lifts;
    this.floors = building.floors;
    this.queue = [];
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
