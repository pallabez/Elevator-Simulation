import { DIMENSIONS, LIFT_STATE } from "../constant/constant";

export class Engine {
  constructor(building) {
    this.building = building;
    this.lifts = building.lifts;
    this.floors = building.floors;
    this.queue = [];
  }

  requestLiftToFloor(floor) {
    const { lift, callAfter } = this.findOptimalLiftForFloor(floor);
    
    setTimeout(() => lift.moveToFloor(floor), callAfter);
  }

  findOptimalLiftForFloor(floor) {
    const staleLift = this.lifts.find(lift => lift.state === LIFT_STATE.CLOSED);
    if(staleLift) return { lift: staleLift, callAfter: 0 };

    let nextAvailableLift = { time: Number.MAX_SAFE_INTEGER, lift: {} };
    
    this.lifts.forEach(lift => {
      const time = availableAfter(lift);  
      if(nextAvailableLift.time > time) {
        nextAvailableLift.time = time;
        nextAvailableLift.lift = lift;
      }
    })

    return { lift: nextAvailableLift.lift, callAfter: nextAvailableLift.time };
  }
}

const availableAfter = (lift) => {
  let distance = Math.abs(lift.targetFloor - lift.floor);
  let prevFloor = lift.targetFloor;
  lift.queue.forEach(queueFloor => {
    distance = Math.abs(prevFloor - queueFloor);
    prevFloor = queueFloor;
  });
  return distance * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS;
}