import { LIFT_STATE } from "../constant/constant";
export class Lift {
  constructor(position, floor = 0, state = LIFT_STATE.CLOSING, percentageDone = 100) {
    this.position = position;
    this.floor = floor;
    this.state = state;
    this.percentageDone = percentageDone;
  }
}