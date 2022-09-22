import { createElement } from '../utils/element';

export class Renderer {
  constructor(building) {
    this.building = building;
    this.rerender();
  }

  rerender() {
    console.log(this.building);

  }


}