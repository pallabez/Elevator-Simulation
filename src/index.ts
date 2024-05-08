import { Engine } from './components/Engine';
import { Lift } from './components/Lift';
import { Building } from './components/Building';
import { Renderer } from './components/Renderer';
import { Floor } from './components/Floor';
import { EventEmitter } from 'events';
import { Debugger } from './components/Debugger';

console.clear();

function initLifts(numberOfLifts = 2, numberOfFloors = 5) {
  const lifts = [];
  const floors = [];
  const eventEmitter = new EventEmitter();

  for(let i = 1; i <= numberOfLifts; i++) {
    lifts.push(new Lift(eventEmitter, i));
  }
  for(let i = 0; i < numberOfFloors; i++) {
    floors.push(new Floor(i));
  }
  
  const building = new Building(floors, lifts, document.getElementById('app'));
  const engine = new Engine(building, eventEmitter);
  const renderer = new Renderer(building, eventEmitter);
  const debug = new Debugger(building, eventEmitter);

  debug.printStateOnEvent();
} 

setTimeout(initLifts, 1000);