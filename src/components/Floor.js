import { DIMENSIONS } from "../constant/constant";
import { createElement } from "../utils/element";

export class Floor {
  constructor() {
    this.height = DIMENSIONS.FLOOR_HEIGHT_PX;

    this.floorElement = this.floorAdapter();
  }

  floorAdapter() {
    return createElement(['floor'], { style: `height: ${this.height}px`})
  }
}