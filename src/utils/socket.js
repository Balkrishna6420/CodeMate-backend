const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // Store currently online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + " joined Room : " + roomId);

      socket.join(roomId);

      // Store user as online
      onlineUsers.set(userId, socket.id);

      // Store userId on socket
      socket.userId = userId;

      // Check if target user is online
      if (onlineUsers.has(targetUserId)) {
        socket.emit("userOnline");
      } else {
        socket.emit("userOffline");
      }

      // Tell target user that this user is online
      const targetSocketId = onlineUsers.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("userOnline");
      }
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          console.log(firstName + " " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // Get the message that was just saved
          const savedMessage =
            chat.messages[chat.messages.length - 1];

          // Send message + timestamp
          io.to(roomId).emit("messageReceived", {
            senderId: userId,
            firstName,
            lastName,
            text,
            createdAt: savedMessage.createdAt,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {
      const userId = socket.userId;

      if (!userId) return;

      onlineUsers.delete(userId);

      console.log("User went offline:", userId);

      // Tell everyone that this user went offline
      io.emit("userOffline", {
        userId,
      });
    });
  });
};

module.exports = initializeSocket;