import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { createElement } from "../utils/element";
export class Lift {
  constructor(position, floor = 0, state = LIFT_STATE.CLOSED) {
    this.position = position;
    this.floor = floor;
    this.targetFloor = floor;
    this.state = state;

    this.liftAdapter();
  }

  liftAdapter() {
    if(this.liftElement) this.liftElement.remove();
    
    this.updatePosition();
    this.liftElement = createElementLift(this.position, DIMENSIONS.LIFT_GAP, this.floor, this.state);
    return this.liftElement;
  }
  
  moveToFloor(floor) {
    this.startTime = Date.now();
    this.targetFloor = floor;
    this.startFloor = this.floor;
    this.state = LIFT_STATE.MOVING;
  }

  updatePosition() {
    const currentTime = Date.now();
    const endTime = this.targetFloor * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS + this.startTime;
    if (currentTime > endTime) {
      this.state = LIFT_STATE.CLOSED;
      this.floor = this.targetFloor;
      return;
    }

    if(this.targetFloor === this.floor) return;

    const duration = currentTime - this.startTime;
    const floorCovered = duration / DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS;
    
    this.floor = this.targetFloor > this.floor ? this.startFloor + floorCovered : this.floor - floorCovered;
  }
}

const createElementLift = (position, gap, floor, state) => {
  const left = position * gap;
  const translateY = floor * DIMENSIONS.FLOOR_HEIGHT_PX;


  const styleLeft = `left: ${left}px;`
  const styleTranslateY = `transform: translateY(-${translateY}px) translateX(-100%)`

  return createElement(['lift'], { style: `${styleLeft} ${styleTranslateY}`});
}