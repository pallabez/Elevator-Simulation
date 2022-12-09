import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { Lift } from '../../src/components/Lift';
import { EventEmitter } from 'events';
import { INITIAL_STATE } from '../fixtures/Lift.fixture';
import { DIMENSIONS, LIFT_EVENT, LIFT_STATE } from '../../src/constant/constant';

describe("Lift", () => {
  let eventEmitter: EventEmitter;
  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  })

  describe("getLiftState", () => {
    it("Should initialize", () => {
      const lift = new Lift(eventEmitter, 0);

      expect(lift).to.exist;
    });

    it("Should return correct states", () => {
      const lift = new Lift(eventEmitter, 0);

      expect(lift.getLiftState()).to.deep.equal({
        eventEmitter,
        ...INITIAL_STATE,
      })
    });

    it("Should return correct position", () => {
      const lift = new Lift(eventEmitter, 2);

      expect(lift.getLiftState().position).to.equal(2);
    })

    it("Should return correct floor", () => {
      const lift = new Lift(eventEmitter, 0, 4);

      expect(lift.getLiftState().floor).to.equal(4);
    })

    it("Should return correct lift state", () => {
      const lift = new Lift(eventEmitter, 0, 0, LIFT_STATE.CLOSED);

      expect(lift.getLiftState().state).to.equal(LIFT_STATE.CLOSED);
    })
  });

  describe("moveToFloor", () => {
    it("Should update lift state", () => {
      vi.useFakeTimers();
      vi.setSystemTime(Date.now());
      const lift = new Lift(eventEmitter, 0);

      lift.moveToFloor(1);

      const liftState = lift.getLiftState();
      expect(liftState.state).to.equal(LIFT_STATE.MOVING);
      expect(liftState.floor).to.equal(0);
      expect(liftState.targetFloor).to.equal(1);
      expect(liftState.startFloor).to.equal(0);
    })

    it("Should emit moving event", () => {
      const spy = vi.spyOn(eventEmitter, 'emit');
      const lift = new Lift(eventEmitter, 0);

      lift.moveToFloor(1);

      expect(spy).toHaveBeenCalledTimes(1);
    })

    it("Should update lift state to close on reaching floor", () => {
      vi.useFakeTimers();
      const lift = new Lift(eventEmitter, 0);

      lift.moveToFloor(1);
      vi.setSystemTime(Date.now() + DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS + 500);

      const liftState = lift.getLiftState();
      expect(liftState.state).to.equal(LIFT_STATE.CLOSED);
      expect(liftState.floor).to.equal(1);
    })

    it("Should emit event on floor reached", () => {
      vi.useFakeTimers();
      const spy = vi.spyOn(eventEmitter, 'emit');
      const lift = new Lift(eventEmitter, 0);

      lift.moveToFloor(1);
      vi.setSystemTime(Date.now() + DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS + 500);
      lift.getLiftState();

      expect(spy).toHaveBeenNthCalledWith(2, LIFT_EVENT.FLOOR_REACHED);
      expect(spy).toHaveBeenNthCalledWith(3, LIFT_EVENT.IS_IDLE);
    })

    it("Should not emit idle event on floor reached", () => {
      vi.useFakeTimers();
      const spy = vi.spyOn(eventEmitter, 'emit');
      const lift = new Lift(eventEmitter, 0);

      lift.moveToFloor(1);
      lift.moveToFloor(4);
      vi.setSystemTime(Date.now() + DIMENSIONS.LIFT_TIME_TO_COVER_FLOOR_IN_MILLI_SECONDS + 500);
      lift.getLiftState();

      expect(spy).not.toHaveBeenNthCalledWith(3, LIFT_EVENT.IS_IDLE);
    })

    it("Should push floor request to queue when lift is busy", () => {
      const lift = new Lift(eventEmitter, 0);

      lift.moveToFloor(1);
      lift.moveToFloor(2);

      expect(lift.getLiftState().queue.length).to.equal(1);
    })
  })
});