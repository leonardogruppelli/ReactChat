const express = require('express')
const app = express()
const port = 3000
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

server.listen(port, () => {
  console.log('server up and running at port %s', port)
})

io.on('connection', socket => {
  console.log('user connected', socket.id)

  socket.broadcast.emit('joined', socket.id)

  socket.on('message', message => {
    io.emit('exchange', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    // if (socket.room) {
    //   var room = socket.room;
    //   io.to(room).emit('leave', socket.id);
    //   socket.leave(room);
    // }
  })

  // socket.on('join', function(name, callback){
  //   console.log('join', name);
  //   var socketIds = socketIdsInRoom(name);
  //   callback(socketIds);
  //   socket.join(name);
  //   socket.room = name;
  // });

  // socket.on('exchange', function(data){
  //   console.log('exchange', data);
  //   data.from = socket.id;
  //   var to = io.sockets.connected[data.to];
  //   to.emit('exchange', data);
  // });
})
