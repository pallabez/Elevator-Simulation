import { DIMENSIONS } from "../constant/constant";
import { createElement } from "../utils/element";
import { Floor } from "./Floor";
import { Lift } from "./Lift";

export class Building {
  lifts: Array<Lift>;
  canvas: HTMLElement;
  floors: Array<Floor>;
  height: number;
  buildingElement: HTMLElement;

  constructor(floors: Array<Floor>, lifts: Array<Lift>, canvas: HTMLElement) {
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