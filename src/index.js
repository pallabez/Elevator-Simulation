import { Engine } from './components/Engine';
import { Lift } from './components/Lift';
import { Building } from './components/Building';
import { Renderer } from './components/Renderer';
import { Floor } from './components/Floor';

console.clear();

function initLifts(numberOfLifts = 1, numberOfFloors = 4) {
  const lifts = [];
  const floors = [];
  
  const engine = new Engine();
  for(let i = 1; i <= numberOfLifts; i++) {
    lifts.push(new Lift(i));
  }
  for(let i = 0; i < numberOfFloors; i++) {
    floors.push(new Floor(i, engine));
  }
  
  const building = new Building(floors, lifts, document.getElementById('app'));
  engine.setBuilding(building);
  const renderer = new Renderer(building);

  // setTimeout(() => engine.requestLiftToFloor(0), 4000);
  // setTimeout(() => engine.requestLiftToFloor(3), 4000);
} 

setTimeout(initLifts, 1000);