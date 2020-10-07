const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true, // no & shit
});

const outputMessage = ({ username, text, date }) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${username} <span>${date}</span></p>
  <p class="text">
  ${text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

const outputRoomName = (room) => {
  roomName.innerText = room;
};

const outputUsers = (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
};

const socket = new io('http://localhost:5000');

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Sending message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newMessage = e.target.elements.msg.value;
  socket.emit('chatMessage', newMessage);
  //   e.target.elements.msg.value = '';
  //   e.target.elements.msg.focus();
});
