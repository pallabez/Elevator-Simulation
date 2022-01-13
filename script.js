let maxFloors = 3;
let queue = [];

//Moves elevator to target location
let floorChange = function(elevator, targetFloor) {
    let currFloor = elevator.getAttribute("on-Floor");

    let duration = (targetFloor - currFloor) * 2;
    if(duration < 0) duration *= -1;        //target floor can be below current floor

    elevator.setAttribute("on-floor", targetFloor);
    elevator.style.transition = "bottom " + duration + "s linear";
    elevator.style.bottom = targetFloor * 10 + 'rem';
    elevator.classList.add('busy');

    let doorLeft = document.querySelector('.door-left');
    let doorRight = document.querySelector('.door-right');
    setTimeout(() => {
        doorLeft.style.width = "0";
        doorRight.style.width = "0";
    }, duration * 1000)

    setTimeout(() => {
        doorLeft.style.width = "50%";
        doorRight.style.width = "50%";
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
    
    refreshListeners();
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

function elevatorRoute(targetFloor) {
    let elevator = document.querySelector(".elevator");

    if(elevator.classList.contains('busy')) {
        queue.push(targetFloor);
        console.log(queue);
    } else {
        floorChange(elevator, targetFloor);
    }
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