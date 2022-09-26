import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { createElement } from "../utils/element";
export class Lift {
  constructor(position, floor = 0, state = LIFT_STATE.CLOSED) {
    this.position = position;
    this.floor = floor;
    this.targetFloor = floor;
    this.state = state;
    this.queue = [];
    this.liftElement = null;
  }

  renderLift() {
    if(!this.isLiftCreated()) {
      this.createLift();
      return this.liftElement;
    };

    if(this.isLiftIdle()) return this.liftElement;
    
    this.updatePosition();
    this.updateLiftRender();
    return this.liftElement;
  }
  
  moveToFloor(floor) {
    if(!this.isLiftIdle()) {
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

  isLiftCreated() {
    return Boolean(this.liftElement);
  }

  isLiftIdle() {
    return this.state === LIFT_STATE.CLOSED;
  }

  createLift() {
    const left = this.position * DIMENSIONS.LIFT_GAP;
    const translateY = this.floor * DIMENSIONS.FLOOR_HEIGHT_PX;

    const styleLeft = `${left}px`
    const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`
  
    const el = createElement(['lift']);
    el.style.left = styleLeft;
    el.style.transform = styleTranslate;
    
    this.liftElement = el;
  }

  updateLiftRender() {
    const liftEl = this.liftElement;
    const translateY = this.floor * DIMENSIONS.FLOOR_HEIGHT_PX;
    
    const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`
    
    liftEl.style.transform = styleTranslate; 
  }
}
