import { DIMENSIONS } from "../constant/constant";
import { createElement } from "../utils/element";
import { Floor } from "./Floor";

export class Building {
  constructor(floors, lifts, canvas) {
    this.floors = floors;
    this.canvas = canvas;
    this.lifts = lifts;
    this.height = floors.length * DIMENSIONS.FLOOR_HEIGHT_PX;

    this.buildingElement = this.buildingAdapter();
  }

  buildingAdapter() {
    return createElement(['building']);
  }
}