import { Engine } from './js/Engine';
import { Lift } from './js/Lift';
import { Building } from './js/Building';
import { Renderer } from './js/Renderer';

console.clear();

function initLifts(numberOfLifts = 3, numberOfFloors = 4) {
  const engine = new Engine();
  const lifts = [];
  
  for(let i = 1; i <= numberOfLifts; i++) {
    lifts.push(new Lift(i));
  }

  const building = new Building(numberOfFloors, lifts, document.getElementById('building'));
  const renderer = new Renderer(building);
}

setTimeout(initLifts, 1000);