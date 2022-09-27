import { DIMENSIONS, LIFT_STATE } from "../constant/constant";
import { createElement } from "../utils/element";
export class Lift {
  position: number;
  floor: number;
  targetFloor: number | null;
  state: string;
  queue: Array<number>;
  liftElement: HTMLElement;
  startTime: Date;
  startFloor: number;

  constructor(position: number, floor: number = 0, state: string = LIFT_STATE.CLOSED) {
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
  
  moveToFloor(floor: number) {
    if(!this.isLiftIdle()) {
      this.queue.push(floor);
      return;
    };
    this.startTime = new Date();
    this.targetFloor = floor;
    this.startFloor = this.floor;
    this.state = LIFT_STATE.MOVING;
  }
  
  updatePosition() {
    const currentTime = Date.now();
    const distance = Math.abs(this.targetFloor - this.startFloor);
    const endTime = distance * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS + this.startTime.getTime();
    
    if (currentTime > endTime) {
      this.state = LIFT_STATE.CLOSED;
      this.floor = this.targetFloor;
      if(this.queue.length) this.moveToFloor(this.queue.shift())
      return;
    }
    
    if(this.targetFloor === this.floor) return;
    
    const durationCovered = currentTime - this.startTime.getTime();
    const floorCovered = durationCovered / DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_SECONDS;
    this.floor = this.targetFloor > this.floor 
    ? this.startFloor + floorCovered 
    : this.startFloor - floorCovered;
  }

  isLiftCreated(): Boolean {
    return Boolean(this.liftElement);
  }

  isLiftIdle(): Boolean {
    return this.state === LIFT_STATE.CLOSED;
  }

  createLift(): void {
    const left = this.position * DIMENSIONS.LIFT_GAP;
    const translateY = this.floor * DIMENSIONS.FLOOR_HEIGHT_PX;

    const styleLeft = `${left}px`
    const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`
  
    const el = createElement(['lift']);
    el.style.left = styleLeft;
    el.style.transform = styleTranslate;
    
    this.liftElement = el;
  }

  updateLiftRender(): void {
    const liftEl = this.liftElement;
    const translateY = this.floor * DIMENSIONS.FLOOR_HEIGHT_PX;
    
    const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`
    
    liftEl.style.transform = styleTranslate; 
  }
}
