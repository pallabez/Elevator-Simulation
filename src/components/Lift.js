import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { createElement } from "../utils/element";
export class Lift {
  constructor(position, floor = 0, state = LIFT_STATE.CLOSED) {
    this.position = position;
    this.floor = floor;
    this.targetFloor = floor;
    this.state = state;
    this.queue = [];

    this.liftAdapter();
  }

  liftAdapter() {
    if(this.liftElement) this.liftElement.remove();
    if(this.liftElement && this.state === LIFT_STATE.CLOSED) return this.liftElement;

    this.updatePosition();
    this.liftElement = createElementLift(this.position, DIMENSIONS.LIFT_GAP, this.floor, this.state);
    return this.liftElement;
  }
  
  moveToFloor(floor) {
    if(!LIFT_STATE.CLOSED) {
      this.queue.push(floor);
      return;
    };
    this.startTime = Date.now();
    this.targetFloor = floor;
    this.startFloor = this.floor;
    this.state = LIFT_STATE.MOVING;
  }

  updatePosition() {
    const currentTime = Date.now();
    const distance = Math.abs(this.targetFloor - this.startFloor);
    const endTime = distance * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS + this.startTime;

    if (currentTime > endTime) {
      this.state = LIFT_STATE.CLOSED;
      this.floor = this.targetFloor;
      if(this.queue.length) this.moveToFloor(this.queue.shift())
      return;
    }
    
    if(this.targetFloor === this.floor) return;

    const durationCovered = currentTime - this.startTime;
    const floorCovered = durationCovered / DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS;
    this.floor = this.targetFloor > this.floor 
      ? this.startFloor + floorCovered 
      : this.startFloor - floorCovered;
  }
}

const createElementLift = (position, gap, floor, state) => {
  const left = position * gap;
  const translateY = floor * DIMENSIONS.FLOOR_HEIGHT_PX;


  const styleLeft = `left: ${left}px;`
  const styleTranslateY = `transform: translateY(-${translateY}px) translateX(-100%)`

  return createElement(['lift'], { style: `${styleLeft} ${styleTranslateY}`});
}