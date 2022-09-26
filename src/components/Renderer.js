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
    this.floors.forEach(floor => buildingRef.append(floor.floorElement));
    
    this.canvas.append(buildingRef);
    
    requestAnimationFrame(() => {
      this.rerender();
    })
  };

  rerender() {
    const buildingRef = this.building.buildingElement;
    this.lifts.forEach(lift => {
      buildingRef.append(lift.liftAdapter());
    });

    requestAnimationFrame(() => {
      this.rerender();
    })
  }
}