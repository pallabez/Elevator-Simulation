"use strict";

let maxFloors = 0;
let numeberOfElevators = 1;
let liftsQueue = {};

const socket = io("ws://kuro-lift-simulation.herokuapp.com");

socket.on("connect", () => {
    console.log(socket.id);
});

socket.on("sync", ({ lifts, floors}) => {
    setLifts(lifts);
    setFloors(floors);
})

socket.on("floorChange", floor => setFloors(floor));
socket.on("liftChange", (pos, targetFloor) => floorChange(pos, targetFloor));
socket.on('addLift', () => addElevator());
socket.on('removeLift', () => removeElevator());

// Sets the floor to the desired result
let setFloors = function(floors) {
    while(floors != maxFloors) {
        (floors > maxFloors) ? addFloor(): removeFloor();
    }
}

let renderLifts = (liftsNumber) => {
    while(numeberOfElevators != liftsNumber) {
        (numeberOfElevators < liftsNumber) ? addElevator() : removeElevator();
    }
}

let setLifts = function(lifts) {
    renderLifts(lifts.length);
    const elevators = document.querySelectorAll('.elevator');
    lifts.forEach((pos, i) => {
        liftsQueue[i] = [];
        elevators[i].setAttribute("on-floor", pos);
        elevators[i].style.transition = `none`;
        elevators[i].style.transform = `translateY(${-(pos * 10 + 0.1)}rem)`
    });
}

// Moves elevator to target location
let floorChange = function(pos, targetFloor) {
    const elevators = document.querySelectorAll('.elevator');
    const elevator = elevators[pos];

    if(elevator.classList.contains('busy')) {
        return liftsQueue[pos].push(targetFloor);
    }

    let currFloor = elevator.getAttribute("on-Floor");
    let duration = Math.abs(targetFloor - currFloor) * 2;      //target floor can be below current floor

    elevator.setAttribute("on-floor", targetFloor);
    elevator.style.transition = `transform ${duration}s linear`;
    elevator.style.transform = `translateY(${-(targetFloor * 10 + 0.1)}rem)`;
    elevator.classList.add('busy');

    let doors = elevator.querySelectorAll('.door');
    
    setTimeout(() => {
        doors[0].style.transform = `translateX(-1.5rem)`
        doors[1].style.transform = `translateX(1.5rem)`
    }, duration * 1000)

    setTimeout(() => {
        doors[0].style.transform = "none"
        doors[1].style.transform = "none"
    }, duration * 1000 + 2000)
    
    setTimeout(() => {
        elevator.classList.remove('busy');
        if(liftsQueue[pos].length) floorChange(pos, liftsQueue[pos].shift())
        
    }, duration * 1000 + 4000);
}

function customCreateElement({ type="div", attributes={}, text="" }) {
    const element = document.createElement(type);
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    })

    element.textContent = text;
    
    return element;
}

// Adds floor 
let add = document.querySelector('.add-btn');
add.addEventListener('click', () => socket.emit("addFloor"));

function addFloor() {
    maxFloors++;
    const floor = customCreateElement({ attributes: { class: "floor" }});

    const btnContainer = customCreateElement({ attributes: { class: "btn-container" }});
    const floorNumber = customCreateElement({ attributes: { class: "floor-number"}, text: `Floor ${maxFloors}`});

    const btnUp = customCreateElement({ attributes: { class: "btn up-btn", floor: maxFloors }, text: "Up"});
    const btnDown = customCreateElement({ attributes: { class: "btn down-btn", floor: maxFloors }, text: "Down"});
    btnUp.addEventListener('click', () => socket.emit("called", btnUp.getAttribute("floor")));
    btnDown.addEventListener('click', () => socket.emit("called", btnDown.getAttribute("floor")));

    btnContainer.appendChild(btnUp);
    btnContainer.appendChild(btnDown);
    floor.appendChild(btnContainer);
    floor.appendChild(floorNumber);

    document.querySelector('.building').prepend(floor);
}

// Remove floor
let remove = document.querySelector('.remove-btn');
remove.addEventListener('click', () => socket.emit("removeFloor"));
function removeFloor() {
    maxFloors--;

    let floors = document.querySelectorAll('.floor');
    floors[0].remove();
}

// Add lift
let addLift = document.querySelector('#add-lift');
addLift.addEventListener('click', () => socket.emit('addLift'));

function addElevator() {
    let width = window.innerWidth;
    if(width < 769 && numeberOfElevators >= (width - 150)/ 80) return;
    if(width >= 769 && numeberOfElevators >= (width - 300)/ 110) return;

    numeberOfElevators++;
    let elevators = document.querySelectorAll('.elevator');
    let lastELevator = elevators[elevators.length - 1];
    
    let newElevator = document.createElement('div');
    newElevator.classList.add('elevator');
    newElevator.setAttribute('on-floor', "0");
    newElevator.setAttribute('pos', numeberOfElevators);

    newElevator.innerHTML = `
        <div class="door"></div>
        <div class="door"></div>`;

    lastELevator.after(newElevator);

    refreshElevators();
}

// Remove Lift
let removeLift = document.querySelector('#remove-lift');
removeLift.addEventListener('click', () => socket.emit("removeLift"));

function removeElevator() {
    if(numeberOfElevators == 1) return;
    
    let elevators = document.querySelectorAll('.elevator');
    let lastELevator = elevators[elevators.length - 1];
    
    lastELevator.remove();
    numeberOfElevators--;
}

const btnUp = document.querySelector(".up-btn");
const btnDown = document.querySelector(".down-btn")
btnUp.addEventListener('click', () => socket.emit("called", btnUp.getAttribute("floor")));
btnDown.addEventListener('click', () => socket.emit("called", btnDown.getAttribute("floor")));

function refreshElevators() {
    let elevators = document.querySelectorAll('.elevator');
    for(let i = 0; i < elevators.length; i++) {
        elevators[i].style.left = 120 + (i * 60) + 'px';
    }
}
refreshElevators();