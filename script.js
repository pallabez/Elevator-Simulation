let up = document.querySelectorAll(".up-btn");
let down = document.querySelectorAll(".down-btn");

let elevator = document.querySelector(".elevator");
let maxFloors = 4;

let floorChange = function(elevator, nextFloor) {
    elevator.setAttribute("on-Floor", nextFloor);
    elevator.style.bottom = nextFloor * 10 + 'rem';
}

for(let i of up) {
    i.addEventListener('click', function(event) {
        let currFloor = parseInt(elevator.getAttribute("on-floor"));
        if(currFloor < maxFloors - 1) floorChange(elevator, currFloor + 1);
    });
}

for(let i of down) {
    i.addEventListener('click', function(event) {
        let currFloor = parseInt(elevator.getAttribute("on-floor"));
        if(currFloor > 0) floorChange(elevator, currFloor - 1);
    });
}