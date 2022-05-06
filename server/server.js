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
  const lifts = liftStates.map(lift => lift.floor);
  socket.emit("sync", { lifts, floors })

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
  socket.on('addLift', () => {
    liftStates[liftStates.length] = {
      floor: 0,
      available: true,
    }

    io.emit('addLift');
  });

  // Remove Lift
  socket.on('removeLift', () => {
    if(liftStates.length <= 1) return;
    
    liftStates.pop();

    io.emit('removeLift');
  })

  // Lift called
  socket.on("called", callLift);
});


const callLift = (calledOn) => {
  let pos = null, minDistance = Infinity, distance;
  liftStates.forEach((lift, i) => {
    if(!lift.available) return;

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

      if(queue.length) callLift(queue.shift());
    }, (distance + 4) * 1000);

    return io.emit('liftChange', pos, calledOn);
  }
  queue.push(calledOn);
}

httpServer.listen(3000);