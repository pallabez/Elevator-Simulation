import { Engine } from './components/Engine';
import { Lift } from './components/Lift';
import { Building } from './components/Building';
import { Renderer } from './components/Renderer';
import { Floor } from './components/Floor';

console.clear();

function initLifts(numberOfLifts = 2, numberOfFloors = 4) {
  const lifts = [];
  const floors = [];
  
  for(let i = 1; i <= numberOfLifts; i++) {
    lifts.push(new Lift(i));
  }
  for(let i = 1; i <= numberOfFloors; i++) {
    floors.push(new Floor());
  }
  
  const building = new Building(floors, lifts, document.getElementById('app'));
  const engine = new Engine(building);
  const renderer = new Renderer(building);

  setTimeout(() => engine.requestLiftToFloor(2), 1000);
  setTimeout(() => engine.requestLiftToFloor(1), 1500);
  setTimeout(() => engine.requestLiftToFloor(0), 4000);
  setTimeout(() => engine.requestLiftToFloor(0), 4002);
} 

setTimeout(initLifts, 1000);