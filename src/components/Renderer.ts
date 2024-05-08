import { EventEmitter } from "events";
import { DIMENSIONS, FLOOR_EVENT, LIFT_EVENT } from "../constant/constant";
import { createElement, createElementButton } from "../utils/element";
import { Building } from "./Building";
import { Floor } from "./Floor";
import { Lift } from "./Lift";

interface LiftRef {
  liftEl: HTMLElement;
  lift: Lift;
}

interface FloorRef {
  floorEl: HTMLElement;
  floorUpEl: HTMLElement;
  floorDownEl: HTMLElement;
  floor: Floor;
}

export class Renderer {
  building: Building;
  canvas: HTMLElement;
  lifts: Array<LiftRef>;
  floors: Array<FloorRef>;
  eventEmitter: EventEmitter;

  constructor(building: Building, eventEmitter: EventEmitter) {
    this.building = building;
    this.canvas = building.canvas;
    this.lifts = liftsAdapter(building.lifts);
    this.floors = floorsAdapter(building.floors);
    this.eventEmitter = eventEmitter;
    this.initialize();
  }

  private initialize() {
    const buildingRef = this.building.buildingElement;

    this.floors.forEach(floorRef => {
      floorRef.floorUpEl.addEventListener('click', () => {
        this.eventEmitter.emit(FLOOR_EVENT.FLOOR_BUTTON_UP_CLICK, floorRef.floor.floorNumber);
      });
      floorRef.floorDownEl.addEventListener('click', () => {
        this.eventEmitter.emit(FLOOR_EVENT.FLOOR_BUTTON_DOWN_CLICK, floorRef.floor.floorNumber);
      });
      buildingRef.prepend(floorRef.floorEl);
    });
    this.lifts.forEach(liftRef => buildingRef.append(liftRef.liftEl));
    this.canvas.append(buildingRef);

    const buildingWidth = `${(DIMENSIONS.LIFT_GAP + 40) * this.lifts.length + DIMENSIONS.FIRST_LIFT_GAP}px`;
    this.building.buildingElement.style.width = buildingWidth;

    this.eventEmitter.on(LIFT_EVENT.FLOOR_REACHED, (liftPosition) => {
      const liftRef = this.lifts.find(liftRef => liftRef.lift.position === liftPosition);
      
      liftRef.liftEl.classList.add('lift--open');
    })
    
    this.eventEmitter.on(LIFT_EVENT.DOOR_OPEN, (liftPosition) => {
      const liftRef = this.lifts.find(liftRef => liftRef.lift.position === liftPosition);
      
      liftRef.liftEl.classList.remove('lift--open');
    })

    requestAnimationFrame(() => this.rerender());
  };

  private rerender() {
    this.lifts.forEach(liftRef => updateLiftElement(liftRef));
    requestAnimationFrame(() => this.rerender());
  }
}

function floorsAdapter(floors: Array<Floor>): Array<FloorRef> {
  return floors.map(floor => {
    return {
      ...renderFloor(floor),
      floor,
    }
  })
}

function liftsAdapter(lifts: Array<Lift>): Array<LiftRef> {
  return lifts.map(lift => {
    return {
      liftEl: renderLift(lift),
      lift,
    }
  })
}

function updateLiftElement(liftRef: LiftRef) {
  const { lift, liftEl } = liftRef;
  if (lift.isLiftIdle()) return;

  const liftState = lift.getLiftState();

  const translateY = (liftState.floor / 1000) * DIMENSIONS.FLOOR_HEIGHT_PX;
  const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`

  liftEl.style.transform = styleTranslate;
}

function renderFloor(floor: Floor): { floorEl: HTMLElement, floorUpEl: HTMLElement, floorDownEl: HTMLElement } {
  const el = createElement(['floor']);
  el.style.height = `${floor.height}px`;

  const buttonUpEl = createElementButton(['floor__button', 'floor__button--up']);
  const buttonDownEl = createElementButton(['floor__button', 'floor__button--down']);

  buttonDownEl.textContent = 'Down';
  buttonUpEl.textContent = 'Up';
  el.append(buttonUpEl, buttonDownEl);

  return {
    floorEl: el,
    floorUpEl: buttonUpEl,
    floorDownEl: buttonDownEl,
  };
}

function renderLift(lift: Lift): HTMLElement {
  const left = lift.position * DIMENSIONS.LIFT_GAP + DIMENSIONS.FIRST_LIFT_GAP;
  const translateY = lift.floor * DIMENSIONS.FLOOR_HEIGHT_PX;

  const styleLeft = `${left}px`
  const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`

  const el = createElement(['lift']);
  el.style.left = styleLeft;
  el.style.transform = styleTranslate;

  const doorLeft = createElement(['lift__door', 'door--left']);
  const doorRight = createElement(['lift__door', 'door--right']);

  el.append(doorLeft, doorRight);

  return el;
}