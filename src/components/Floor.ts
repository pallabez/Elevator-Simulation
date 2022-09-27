import { DIMENSIONS } from "../constant/constant";
import { createElement } from "../utils/element";

export class Floor {
  constructor(floorNumber) {
    this.height = DIMENSIONS.FLOOR_HEIGHT_PX;
    this.floorNumber = floorNumber;
    this.buttonUpEl = null;
    this.buttonDownEl = null;
    this.floorElement = this.floorAdapter();
  }

  setButtonListener(callback) {
    this.buttonUpEl.addEventListener('click', callback);
    this.buttonDownEl.addEventListener('click', callback);
  }

  floorAdapter() {
    const el = createElement(['floor']);
    el.style.height = `${this.height}px`;

    const buttonUpEl = createElement(['floor__button', 'floor__button--up']);
    const buttonDownEl = createElement(['floor__button', 'floor__button--down']);

    this.buttonUpEl = buttonUpEl;
    this.buttonDownEl = buttonDownEl;

    el.append(buttonUpEl, buttonDownEl);

    return el;
  }
}