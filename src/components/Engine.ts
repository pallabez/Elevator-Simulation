import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { Building } from "./Building";
import { Floor } from "./Floor";
import { Lift } from "./Lift";

export class Engine {
  lifts: Array<Lift>
  floors: Array<Floor>
  building: Building;

  constructor(building: Building) {
    this.building = building;
    this.lifts = building.lifts;
    this.floors = building.floors;
  }

  requestLiftToFloor(floor: number) {
    const nextAvailableLift = this.findOptimalLiftForFloor(floor);
    if(!nextAvailableLift) return;

    setTimeout(() => nextAvailableLift.lift.moveToFloor(floor), nextAvailableLift.callAfter);
  }

  findOptimalLiftForFloor(floor: number): { lift: Lift, callAfter: number } | null {
    if(!this.lifts) return null;
    const staleLift = this.lifts.find(lift => lift.state === LIFT_STATE.CLOSED);
    if (staleLift) return { lift: staleLift, callAfter: 0 };

    let nextAvailableLift = { time: Number.MAX_SAFE_INTEGER, lift: this.lifts[0]};

    this.lifts.forEach(lift => {
      const time = availableAfter(lift);
      if (nextAvailableLift.time > time) {
        nextAvailableLift.time = time;
        nextAvailableLift.lift = lift;
      }
    })

    return { lift: nextAvailableLift.lift, callAfter: nextAvailableLift.time };
  }
}

const availableAfter = (lift: Lift): number => {
  let distance = Math.abs(lift.targetFloor - lift.floor);
  let prevFloor = lift.targetFloor;
  lift.queue.forEach(queueFloor => {
    distance = Math.abs(prevFloor - queueFloor);
    prevFloor = queueFloor;
  });
  return distance * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS;
}