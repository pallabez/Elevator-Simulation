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

  on(eventName: string, callback: () => {}) {
    this.eventEmitter.on(eventName, callback);
  }

  private updatePosition() {
    const currentTime = Date.now();
    const distance = Math.abs(this.targetFloor - this.startFloor);
    const endTime = distance * DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS + this.startTime.getTime();

    if (currentTime > endTime) {
      this.state = LIFT_STATE.CLOSED;
      this.floor = this.targetFloor;
      this.eventEmitter.emit(LIFT_EVENT.FLOOR_REACHED, this.position);
    setTimeout(() => this.eventEmitter.emit(LIFT_EVENT.DOOR_OPEN, this.position), 1000);

      if (this.queue.length) return this.moveToFloor(this.queue.shift());
      setTimeout(() => this.eventEmitter.emit(LIFT_EVENT.IS_IDLE), 2000);
    }

    if (this.targetFloor === this.floor) return;

    const durationCovered = currentTime - this.startTime.getTime();
    const floorCovered = durationCovered / DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS;
    this.floor = this.targetFloor > this.floor
      ? this.startFloor + floorCovered
      : this.startFloor - floorCovered;
  }
}
