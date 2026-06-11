const onlineUsers = new Map();

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", ({ userId, role }) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      socket.join(role);
      io.emit("presence:update", { userId, role, online: true });
    });

    socket.on("driver:location", ({ driverId, location }) => {
      socket.broadcast.to("rider").emit("driver:location", { driverId, location });
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("presence:update", { userId, online: false });
          break;
        }
      }
    });
  });
};
