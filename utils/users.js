const users = [];

exports.joinUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

exports.getCurrentUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

exports.leaveUser = (id) => {
  const user = users.find((user) => user.id === id);
  users.filter((user) => user.id !== id);
  return user;
};

exports.getRoomUsers = (room) => {
  const availUsers = users.filter((user) => user.room === room);
  return availUsers;
};
