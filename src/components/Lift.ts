import { LIFT_EVENT, LIFT_STATE, LIFT_STATS } from "../constant/constant";
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
    setTimeout(() => this.eventEmitter.emit(LIFT_EVENT.DOOR_OPEN, this.position), LIFT_STATS.TIME_TO_OPEN_DOOR_IN_MILLI_SECONDS);
    setTimeout(() => {
      this.state = LIFT_STATE.CLOSED;
      this.eventEmitter.emit(LIFT_EVENT.IS_IDLE)
    }, LIFT_STATS.TIME_TO_OPEN_DOOR_IN_MILLI_SECONDS * 2);
  }

  getLiftState(): Lift {
    if (this.isLiftIdle()) return this;

    this.updatePosition();
    return this;
  }

  moveToFloor(floor: number) {
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
    const timeToReach = this.getTimeToReach().getTime();

    // Calculate current position considering velocity and elapsed time
    const currentPosition =  this.getCurrentPosition();

    if (
      timeToReach <= currentTime &&
      this.state === LIFT_STATE.MOVING
    ) {
        this.eventEmitter.emit(LIFT_EVENT.FLOOR_REACHED, this.position);
        this.startDoorAnimation();
        this.state = LIFT_STATE.OPENING;
    }

    else {
      this.floor = currentPosition;
    }
  }

  private getCurrentPosition(): number {
    const {
      accelerationTime: a,
      maxVelocityTime: v,
    } = this.getTimeBreakdown();

    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime.getTime())/1000;
    const direction = this.targetFloor > this.startFloor ? 1 : -1;

    if (elapsedTime >= 2 * a + v) return this.targetFloor;

    if (elapsedTime <= a) {
      // Before max velocity
      return this.startFloor + 0.5 * LIFT_STATS.ACCELERATION * Math.pow(elapsedTime, 2) * direction;
    }

    else if (elapsedTime <= a + v) {
      return this.startFloor + (
        // Before max velocity
        0.5 * LIFT_STATS.ACCELERATION * Math.pow(a, 2) +
        // During max velocity
        LIFT_STATS.MAX_VELOCITY * (elapsedTime - a)
      ) * direction;
    }

    else {
      return this.startFloor + (
        // Before max velocity
        0.5 * LIFT_STATS.ACCELERATION * Math.pow(a, 2) +
        // During max velocity
        LIFT_STATS.MAX_VELOCITY * v +
        // After max velocity
        LIFT_STATS.ACCELERATION * a * (elapsedTime - a - v) - 0.5 * LIFT_STATS.ACCELERATION * Math.pow(elapsedTime - a - v, 2)
      ) * direction;
    }
  }

  private getTimeToReach(): Date {
    const {
      accelerationTime: a,
      maxVelocityTime: v,
    } = this.getTimeBreakdown();
    
    // 2 * acceleration time + maxVelocitytime + starting time
    return new Date(this.startTime.getTime() + (2 * a + v) * 1000);
  }

  private getTimeBreakdown(): {
    accelerationTime: number,
    maxVelocityTime: number,
  } {
    const d = Math.abs(this.targetFloor - this.startFloor);
    const v = LIFT_STATS.MAX_VELOCITY, a = LIFT_STATS.ACCELERATION;

    const mVT = this.getMaxVelocityTime();

    return {
      maxVelocityTime: mVT,
      accelerationTime: mVT ? v / a : Math.sqrt(d/a),
    }
  }

  private getMaxVelocityTime(): number {
    const d = Math.abs(this.targetFloor - this.startFloor);
    const v = LIFT_STATS.MAX_VELOCITY, a = LIFT_STATS.ACCELERATION;

    const t = Math.sqrt(d/a);
    if (a * t <= v) return 0;

    return (d - (Math.pow(v, 2) / a))/v;
  }
}
