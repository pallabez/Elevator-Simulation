import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { createElement } from "../utils/element";
export class Lift {
  constructor(position, floor = 0, state = LIFT_STATE.CLOSING, fractionDone = 1) {
    this.position = position;
    this.floor = floor;
    this.state = state;
    this.fractionDone = fractionDone;

    this.liftElement = this.liftAdapter();
  }

  liftAdapter() {
    return createElementLift(this.position, 60, this.floor, this.fractionDone, this.state);
  }
}

const createElementLift = (position, gap, floor, fractionDone, state) => {
  const left = position * gap;
  let translateY = floor * DIMENSIONS.FLOOR_HEIGHT_PX;
  
  switch(state) {
    case LIFT_STATE.MOVING_UP:
      translateY = translateY + DIMENSIONS.FLOOR_HEIGHT_PX * fractionDone;
      break;
    case LIFT_STATE.MOVING_DOWN:
      translateY = translateY - DIMENSIONS.FLOOR_HEIGHT_PX * fractionDone;
      break;
  }

  const styleLeft = `left: ${left}px;`
  const styleTranslateY = `transform: translateY(-${translateY}px) translateX(-100%)`

  return createElement(['lift'], { style: `${styleLeft} ${styleTranslateY}`});
}