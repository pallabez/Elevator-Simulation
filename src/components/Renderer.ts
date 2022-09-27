export class Renderer {
  constructor(building) {
    this.building = building;
    this.canvas = building.canvas;
    this.lifts = building.lifts;
    this.floors = building.floors;

    this.render();
  }

  render() {
    const buildingRef = this.building.buildingElement;
    this.floors.forEach(floor => buildingRef.prepend(floor.floorElement));
    this.lifts.forEach(lift => {
      buildingRef.append(lift.renderLift());
    });

    this.canvas.append(buildingRef);
    
    requestAnimationFrame(() => {
      this.rerender();
    })
  };

  rerender() {
    this.lifts.forEach(lift => {
      lift.renderLift();
    });

    requestAnimationFrame(() => {
      this.rerender();
    })
  }
}