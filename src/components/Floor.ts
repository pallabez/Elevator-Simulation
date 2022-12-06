import { DIMENSIONS } from "../constant/constant";
import { createElement, createElementButton } from "../utils/element";

export class Floor {
  height: number;
  floorNumber: number;
  buttonUpEl: HTMLButtonElement;
  buttonDownEl: HTMLButtonElement;
  floorElement: HTMLElement;

  constructor(floorNumber: number) {
    this.height = DIMENSIONS.FLOOR_HEIGHT_PX;
    this.floorNumber = floorNumber;
    this.buttonUpEl = null;
    this.buttonDownEl = null;
    this.floorElement = this.floorAdapter();
  }

  setButtonListener(callback: () => void): void {
    this.buttonUpEl.addEventListener('click', callback);
    this.buttonDownEl.addEventListener('click', callback);
  }

  floorAdapter(): HTMLElement {
    const el = createElement(['floor']);
    el.style.height = `${this.height}px`;

    const buttonUpEl = createElementButton(['floor__button', 'floor__button--up']);
    const buttonDownEl = createElementButton(['floor__button', 'floor__button--down']);

    this.buttonUpEl = buttonUpEl;
    this.buttonDownEl = buttonDownEl;

    el.append(buttonUpEl, buttonDownEl);

    return el;
  }
}