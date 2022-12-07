import { DIMENSIONS } from "../constant/constant";

export class Floor {
  height: number;
  floorNumber: number;

  constructor(floorNumber: number) {
    this.height = DIMENSIONS.FLOOR_HEIGHT_PX;
    this.floorNumber = floorNumber;
  }
}