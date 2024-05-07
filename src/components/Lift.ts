import { DIMENSIONS, LIFT_EVENT, LIFT_STATE } from "../constant/constant";
import { EventEmitter } from 'events';

export class Lift {
  position: number;
  floor: number;
  startFloor: number;
  targetFloor: number | null;
  state: string;
  queue: Array<number>;
  startTime: Date;
  eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter, position: number, floor: number = 0, state: string = LIFT_STATE.CLOSED) {
    this.position = position;
    this.floor = floor;
    this.targetFloor = floor;
    this.state = state;
    this.queue = [];

    this.eventEmitter = eventEmitter;
  }

  startDoorAnimation() {
    setTimeout(() => this.eventEmitter.emit(LIFT_EVENT.DOOR_OPEN, this.position), 1000);
    setTimeout(() => this.eventEmitter.emit(LIFT_EVENT.IS_IDLE), 2000);
  }

  getLiftState(): Lift {
    if (this.isLiftIdle()) return this;

    this.updatePosition();
    return this;
  }

  moveToFloor(floor: number) {
    if (!this.isLiftIdle()) return this.queue.push(floor);

    this.startTime = new Date();
    this.targetFloor = floor;
    this.startFloor = this.floor;
    this.state = LIFT_STATE.MOVING;
    this.eventEmitter.emit(LIFT_EVENT.STARTED_MOVING);
  }

  isLiftIdle(): Boolean {
    return this.state === LIFT_STATE.CLOSED;
  }

  private updatePosition() {
    const currentTime = Date.now();
    const distance = Math.abs(this.targetFloor - this.startFloor);
    const timeToReach = distance * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS + this.startTime.getTime();
    const timeToBeIdle = timeToReach + DIMENSIONS.LIFT_TIME_TO_OPEN_DOOR_IN_MILLI_SECONDS * 2;

    if (currentTime > timeToReach && this.state === LIFT_STATE.MOVING) {
      this.eventEmitter.emit(LIFT_EVENT.FLOOR_REACHED, this.position);
      this.startDoorAnimation();
      this.state = LIFT_STATE.OPENING;
    };

    if (currentTime > timeToBeIdle && this.state !== LIFT_STATE.CLOSED) {
      this.state = LIFT_STATE.CLOSED;
      this.floor = this.targetFloor;
    }

    if (this.state == LIFT_STATE.MOVING) {
      const durationCovered = currentTime - this.startTime.getTime();
      const floorCovered = durationCovered / DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS;
      this.floor = this.targetFloor > this.floor
        ? this.startFloor + floorCovered
        : this.startFloor - floorCovered;
    }
  }
}
