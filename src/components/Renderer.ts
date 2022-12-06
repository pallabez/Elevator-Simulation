import { DIMENSIONS } from "../constant/constant";
import { createElement } from "../utils/element";
import { Building } from "./Building";
import { Floor } from "./Floor";
import { Lift } from "./Lift";

interface LiftRef {
  liftEl: HTMLElement;
  lift: Lift;
}

export class Renderer {
  building: Building;
  canvas: HTMLElement;
  lifts: Array<LiftRef>
  floors: Array<Floor>

  constructor(building: Building) {
    this.building = building;
    this.canvas = building.canvas;
    this.lifts = liftsAdapter(building.lifts);
    this.floors = building.floors;

    this.initialize();
  }

  private initialize() {
    const buildingRef = this.building.buildingElement;

    this.floors.forEach(floor => buildingRef.prepend(floor.floorElement));
    this.lifts.forEach(liftRef => buildingRef.append(liftRef.liftEl));
    this.canvas.append(buildingRef);
    
    requestAnimationFrame(() => this.rerender());
  };

  private rerender() {
    this.lifts.forEach(liftRef => updateLiftElement(liftRef));
    requestAnimationFrame(() => this.rerender());
  }
}

function updateLiftElement(liftRef: LiftRef): void {
  const { lift, liftEl } = liftRef;
  if (lift.isLiftIdle()) return;

  const liftState = lift.getLiftState();

  const translateY = liftState.floor * DIMENSIONS.FLOOR_HEIGHT_PX;
  const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`

  liftEl.style.transform = styleTranslate;
}

function liftsAdapter(lifts: Array<Lift>): Array<LiftRef> {
  return lifts.map(lift => {
    return {
      liftEl: renderLift(lift),
      lift,
    }
  })
}

function renderLift(lift: Lift): HTMLElement {
  const left = lift.position * DIMENSIONS.LIFT_GAP;
  const translateY = lift.floor * DIMENSIONS.FLOOR_HEIGHT_PX;

  const styleLeft = `${left}px`
  const styleTranslate = `translateY(-${translateY}px) translateX(-100%)`

  const el = createElement(['lift']);
  el.style.left = styleLeft;
  el.style.transform = styleTranslate;

  return el;
}