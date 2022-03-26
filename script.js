"use strict";

let maxFloors = 3;
let numeberOfElevators = 2;
let queue = [];

//Moves elevator to target location
let floorChange = function(elevator, targetFloor) {
    let currFloor = elevator.getAttribute("on-Floor");

    let duration = (targetFloor - currFloor) * 2;
    if(duration < 0) duration *= -1;        //target floor can be below current floor

    elevator.setAttribute("on-floor", targetFloor);
    elevator.style.transition = "bottom " + duration + "s linear";
    elevator.style.bottom = targetFloor * 10 + 0.1 + 'rem';
    elevator.classList.add('busy');

    let doors = elevator.querySelectorAll('.door');
    
    setTimeout(() => {
        doors[0].style.width = "0";
        doors[1].style.width = "0";
    }, duration * 1000)

    setTimeout(() => {
        doors[0].style.width = "50%";
        doors[1].style.width = "50%";
    }, duration * 1000 + 2000)
    
    setTimeout(() => {
        elevator.classList.remove('busy');
        if(queue.length) {
            let nextFloor = queue.shift();
            floorChange(elevator, nextFloor);
        }
    }, duration * 1000 + 4000);
}

//Adds floor when add button is clicked
let add = document.querySelector('.add-btn');
add.addEventListener('click', addFloor);

function addFloor() {
    let topFloor = document.querySelector('.top');
    let floor = document.createElement('div');
    
    floor.classList.add("floor");
    floor.innerHTML = `
        <div class="btn-container">
            <div class="btn up-btn" floor="${maxFloors}">Up</div>
            <div class="btn down-btn" floor="${maxFloors}">Down</div>
        </div>
        <div class="floor-number">Floor ${maxFloors}</div>
        `;

    topFloor.after(floor);
    maxFloors++;
    
    let up = document.querySelectorAll('.floor .up-btn')[0];
    let down = document.querySelectorAll('.floor .down-btn')[1];
    up.addEventListener('click', function() {
        let targetFloor = up.getAttribute("floor");
        elevatorRoute(targetFloor);
    });
    down.addEventListener('click', function() {
        let targetFloor = down.getAttribute("floor");
        elevatorRoute(targetFloor);
    });

    refreshTopFloor();
}

//Refreshes top floor
function refreshTopFloor() {    
    document.querySelector('.top .floor-number').innerHTML = "Floor " + maxFloors;
    document.querySelector('.top .down-btn').setAttribute("floor", maxFloors);
}


//Remove floor when remove button is clicked
let remove = document.querySelector('.remove-btn');
remove.addEventListener('click', removeFloor);

function removeFloor() {
    let floors = document.querySelectorAll('.floor');

    let topSecondFloor = floors[1];
    topSecondFloor.remove();

    maxFloors--;
    refreshTopFloor();
}

let addLift = document.querySelector('#add-lift');
addLift.addEventListener('click', addElevator);

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

let removeLift = document.querySelector('#remove-lift');
removeLift.addEventListener('click', removeElevator);

function removeElevator() {
    if(numeberOfElevators == 1) return;
    
    let elevators = document.querySelectorAll('.elevator');
    let lastELevator = elevators[elevators.length - 1];

    lastELevator.remove();
    numeberOfElevators--;
}

//Pushes the tasks into queue if all elevators are busy
function elevatorRoute(targetFloor) {
    let elevators = document.querySelectorAll(".elevator");

    let elevator = null, minDistance = Infinity;
    for(let i of elevators) {
        if(!i.classList.contains('busy')) {
            let distance = parseInt(i.getAttribute('on-floor')) - targetFloor;
            if(distance < 0) distance *= -1;

            if(distance == 0) {
                floorChange(i, targetFloor);
                return;
            }
            if(distance < minDistance) {
                elevator = i;
                minDistance = distance;
            } 
        }
    }
    if(elevator) return floorChange(elevator, targetFloor);
    queue.push(targetFloor);
    console.log(queue);
}

//Refresh listener for every up and down button
function refreshListeners() {
    //let elevator = document.querySelector(".elevator");
    let up = document.querySelectorAll(".up-btn");
    let down = document.querySelectorAll(".down-btn");

    for(let i of up) {
        i.addEventListener('click', function() {
            let targetFloor = i.getAttribute("floor");
            elevatorRoute(targetFloor);
        });
    }
    
    for(let i of down) {
        i.addEventListener('click', function() {
            let targetFloor = i.getAttribute("floor");
            elevatorRoute(targetFloor);
        });
    }    
}
refreshListeners();


//Displays and Refreshes floor number
function refreshFloorNumber() {
    let floorNumber = document.querySelectorAll('.floor .floor-number');
    for(let i = 0; i <= maxFloors; i++) {
        floorNumber[i].innerHTML = "Floor " + (maxFloors - i);
    }
}
refreshFloorNumber();

function refreshElevators() {
    let elevators = document.querySelectorAll('.elevator');
    for(let i = 0; i < elevators.length; i++) {
        elevators[i].style.left = 120 + (i * 60) + 'px';
    }
}
refreshElevators();