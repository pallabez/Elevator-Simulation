let maxFloors = 3;

//Moves elevator to target location
let floorChange = function(elevator, targetFloor) {
    let currFloor = elevator.getAttribute("on-Floor");
    if(currFloor == targetFloor) return;

    let duration = (targetFloor - currFloor) * 2;
    if(duration < 0) duration *= -1;

    elevator.setAttribute("on-floor", targetFloor);
    elevator.style.transition = "bottom " + duration + "s linear";
    elevator.style.bottom = targetFloor * 10 + 'rem';
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

//Refresh listener for every up and down button
function refreshListeners() {
    let elevator = document.querySelector(".elevator");
    let up = document.querySelectorAll(".up-btn");
    let down = document.querySelectorAll(".down-btn");

    for(let i of up) {
        i.addEventListener('click', function() {
            let targetFloor = i.getAttribute("floor");
            floorChange(elevator, targetFloor);
        });
    }
    
    for(let i of down) {
        i.addEventListener('click', function() {
            let targetFloor = i.getAttribute("floor");
            floorChange(elevator, targetFloor);
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