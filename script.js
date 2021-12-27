let elevator = document.querySelector(".elevator");
let maxFloors = 3;

let floorChange = function(elevator, targetFloor) {
    let currFloor = elevator.getAttribute("on-Floor");
    if(currFloor == targetFloor) return;

    let duration = (targetFloor - currFloor) * 2;
    if(duration < 0) duration *= -1;

    elevator.setAttribute("on-floor", targetFloor);
    elevator.style.transition = "all " + duration + "s linear";
    elevator.style.bottom = targetFloor * 10 + 'rem';
}

let add = document.querySelector('.add-btn');
let topFloor = document.querySelector('.top');

add.addEventListener('click', function() {
    let floor = document.createElement('div');
    floor.classList.add("floor");

    floor.innerHTML = `
        <div class="btn-container">
            <div class="btn up-btn" floor="${maxFloors}">Up</div>
            <div class="btn down-btn" floor="${maxFloors}">Down</div>
        </div>
        <div class="floor-number"></div>
        `;

    topFloor.after(floor);
    maxFloors++;

    refreshListeners();
    refreshFloorNumber();
    document.querySelector('.top .down-btn').setAttribute("floor", maxFloors);
});

//Refresh listener for every up and down button
function refreshListeners() {
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
};

refreshListeners();


//Displays and Refreshes floor number
function refreshFloorNumber() {
    let floorNumber = document.querySelectorAll('.floor .floor-number');
    for(let i = 0; i <= maxFloors; i++) {
        floorNumber[i].innerHTML = "Floor " + (maxFloors - i);
    }
}

refreshFloorNumber();