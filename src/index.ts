import { Engine } from './components/Engine';
import { Lift } from './components/Lift';
import { Building } from './components/Building';
import { Renderer } from './components/Renderer';
import { Floor } from './components/Floor';

console.clear();

function initLifts(numberOfLifts = 1, numberOfFloors = 4) {
  const lifts = [];
  const floors = [];
  
  for(let i = 1; i <= numberOfLifts; i++) {
    lifts.push(new Lift(i));
  }
  for(let i = 0; i < numberOfFloors; i++) {
    floors.push(new Floor(i));
  }
  
  const building = new Building(floors, lifts, document.getElementById('app'));
  const engine = new Engine(building);

  for(const floor of floors) {
    floor.setButtonListener(() => engine.requestLiftToFloor(floor.floorNumber));
  }

  const renderer = new Renderer(building);
} 

setTimeout(initLifts, 1000);