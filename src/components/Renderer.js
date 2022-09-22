export class Renderer {
  constructor(building) {
    this.building = building;
    this.canvas = building.canvas;
    this.lifts = building.lifts;
    this.floors = building.floors;

    this.rerender();
  }

  rerender() {
    console.log(this.lifts, this.floors, this.canvas);

    const buildingRef = this.building.buildingElement;
    this.floors.forEach(floor => buildingRef.append(floor.floorElement));
    
    this.canvas.append(buildingRef);
    // requestAnimationFrame(() => {
    //   this.rerender();
    // })
  }
}