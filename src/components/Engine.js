import { LIFT_STATE } from "../constant/constant";

export class Engine {
  constructor(building) {
    this.building = building;
    this.lifts = building.lifts;
    this.floors = building.floors;
  }

  requestLiftToFloor(floor) {
    const lift = this.findOptimalLiftForFloor(floor);
    lift.moveToFloor(floor);
  }

  findOptimalLiftForFloor(floor) {
    return this.lifts.find(lift => lift.state === LIFT_STATE.CLOSED);
  }
}