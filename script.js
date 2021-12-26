let up = document.querySelectorAll(".up-btn");
let down = document.querySelectorAll(".down-btn");

let elevator = document.querySelector(".elevator");
let maxFloors = 4;

let floorChange = function(elevator, targetFloor) {
    let currFloor = elevator.getAttribute("on-Floor");
    if(currFloor == targetFloor) return;
    else {
        let duration = (targetFloor - currFloor) * 2;
        if(duration < 0) duration *= -1;

        elevator.setAttribute("on-floor", targetFloor);
        elevator.style.transition = "all " + duration + "s linear";
        elevator.style.bottom = targetFloor * 10 + 'rem';
    }
}


//Event listener for every up button
for(let i of up) {
    i.addEventListener('click', function(event) {
        let targetFloor = i.getAttribute("floor");
        floorChange(elevator, targetFloor);
    });
}

//Event listener for every down button
for(let i of down) {
    i.addEventListener('click', function(event) {
        let targetFloor = i.getAttribute("floor");
        floorChange(elevator, targetFloor);
    });
}