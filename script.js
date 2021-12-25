let up = document.querySelectorAll(".up-btn");
let down = document.querySelectorAll(".down-btn");

let elevator = document.querySelector(".elevator");
let currFloor = 0;

for(let i of up) {
    i.addEventListener('click', function(event) {
        currFloor++;
        floorPos = currFloor * 10 + 'rem';
        elevator.style.bottom = floorPos;
    });
}

for(let i of down) {
    i.addEventListener('click', function(event) {
        currFloor--;
        floorPos = currFloor * 10 + 'rem';
        elevator.style.bottom = floorPos;
    });
}