const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5500"
  }
});

const queue = [];
let floors = 4;
const liftStates = [
  {
    floor: 0,
    available: true
  },
  {
    floor: 0,
    available: true
  }
]

io.on("connection", (socket) => {
  // Connection message
  const count = io.engine.clientsCount;
  console.log(`Connected ${socket.id}`, count);

  // Sync up state on new connection
  socket.emit("sync", { liftStates, floors })

  // Add floor
  socket.on("addFloor", async () => {
    io.emit('floorChange', ++floors);
  })

  // Remove floor
  socket.on("removeFloor", async () => {
    if(floors <= 0) return;
    io.emit('floorChange', --floors)
  });

  // Add Lift

  // Remove Lift

  // Lift called
  socket.on("called", callLift);
});


const callLift = (calledOn) => {
  let pos = null, minDistance = Infinity, distance;
  liftStates.forEach((lift, i) => {
    if(!lift.available) return;

    console.log(i, lift)
    distance = Math.abs(calledOn - lift.floor);

    if(distance < minDistance) {
      pos = i;
      minDistance = distance;
    }
  })

  if(pos != null) {
    liftStates[pos].available = false;
    liftStates[pos].floor = calledOn;
    setTimeout(() => {
      liftStates[pos].available = true;

      // Checks queue
      if(queue.length) {
        console.log("queue", queue[0]);
        callLift(queue.shift());
      }
    }, (distance + 4) * 1000);

    return io.emit('liftChange', pos, calledOn);
  }
  queue.push(calledOn);
  console.log(queue);
}

httpServer.listen(3000);