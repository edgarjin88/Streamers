const users = [];

const addUser = ({ id, username, room, userId, profilePhoto }) => {
  // Clean the data
  username = username.trim();
  room = room.trim();

  // Validate the data
  if (!username || !room) {
    // console.log("username or room are required");
    return {
      error: "Username and room are required!",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Same use already in the room!",
    };
  }

  // Store user
  const user = { id, username, room, userId, profilePhoto };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  userList: users,
};
