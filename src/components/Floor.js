import { DIMENSIONS } from "../constant/constant";
import { createElement } from "../utils/element";

export class Floor {
  constructor(floorNumber, engine) {
    this.engine = engine;
    this.height = DIMENSIONS.FLOOR_HEIGHT_PX;
    this.floorNumber = floorNumber;

    this.floorElement = this.floorAdapter();
  }

  setEngine(engine) {
    this.engine = engine;
  }

  floorAdapter() {
    const el = createElement(['floor']);
    el.style.height = `${this.height}px`;

    const buttonUpEl = createElement(['floor__button', 'floor__button--up']);
    const buttonDownEl = createElement(['floor__button', 'floor__button--down']);

    buttonUpEl.addEventListener('click', () => this.engine.requestLiftToFloor(this.floorNumber));
    buttonDownEl.addEventListener('click', () => this.engine.requestLiftToFloor(this.floorNumber));
    
    el.append(buttonUpEl, buttonDownEl);

    return el;
  }
}