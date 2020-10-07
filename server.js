const express = require('express');
const http = require('http');
const { join } = require('path');
const path = require('path');
const socketio = require('socket.io');
const { formatMessage } = require('./utils/formatMessages');
const {
  joinUser,
  getCurrentUser,
  leaveUser,
  getRoomUsers,
} = require('./utils/users');
require('colors');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'ChatBot';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connect', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const newUser = joinUser(socket.id, username, room);

    socket.join(newUser.room);

    socket.emit(
      'message',
      formatMessage(bot, `Welcome To ChatBot, ${username}`)
    ); // emits to single client

    // everyone but the one who connects
    socket.broadcast
      .to(newUser.room)
      .emit('message', formatMessage(bot, `${username} is here`));

    io.to(newUser.room).emit('roomUsers', {
      room: newUser.room,
      users: getRoomUsers(newUser.room),
    });
  });

  socket.on('chatMessage', (message) => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.room).emit(
      'message',
      formatMessage(currentUser.username, message)
    );
  });

  socket.on('disconnect', () => {
    const leftUser = leaveUser(socket.id);

    // io.emit() - emits to EVERYONE
    if (leftUser) {
      io.to(leftUser.room).emit(
        'message',
        formatMessage(bot, `${leftUser.username} has left`)
      );
      io.to(leftUser.room).emit('roomUsers', {
        room: leftUser.room,
        users: getRoomUsers(leftUser.room),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.green.bold);
});
