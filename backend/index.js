const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const { sequelize, Chat } = require("./models");
const loginRoutes = require("./routes/loginRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const profileRoutes = require("./routes/profileRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { authenticateToken } = require("./utils");
const path = require("path");
require("dotenv").config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://pawpals.tech",
  "https://pawpals.tech",
  "http://www.pawpals.tech",
  "https://www.pawpals.tech",
  "https://pawpals-383903.ue.r.appspot.com",
  "https://www.pawpals-383903.ue.r.appspot.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      // if (!origin) return callback(null, true);
      if (origin && allowedOrigins.indexOf(origin) === -1) {
        console.log("ORIGIN: ", origin);
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 4000;
app.set("trust proxy", true);
app.use(bodyParser.urlencoded({ extended: true, limit: "400mb" }));
app.use(bodyParser.json({ limit: "400mb" }));

// MySQL database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connected");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

// Socket chat stuff
let activeUsers = [];
io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    activeUsers.push(data);
    // console.log(activeUsers);
    //Sends the list of activeUsers to the client
    io.emit("newUserResponse", activeUsers);
    console.log("active users: ", activeUsers);
  });

  // When a user joins the chat room
  socket.on("join", (data) => {
    console.log(`User ${data.userId} joined room ${data.roomId}`);
    socket.join(data.roomId);
  });

  // When a user leaves the chat room
  socket.on("leave", (data) => {
    console.log(`User ${data.userId} left room ${data.roomId}`);
    socket.leave(data.roomId);
  });

  // when messages are sent
  socket.on("message", async (data) => {
    console.log(
      `User ${data.senderId} sent private message to user ${data.receiverId}`
    );
    const roomName =
      data.senderId < data.receiverId
        ? `${data.senderId}-${data.receiverId}`
        : `${data.receiverId}-${data.senderId}`;
    socket.join(roomName);

    // Add the message to the database
    const newMessage = await Chat.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
    });
    console.log("Message saved to database");

    // Emit an event to the sender and receiver indicating that the message was saved
    socket.emit("messageSaved", newMessage);
    socket.to(roomName).emit("message", newMessage);
    console.log("emitted message to room ", roomName);
  });

  // when a user is typing a message
  socket.on("typing", (data) => {
    socket.broadcast.emit("typingResponse", data);
  });

  // When a user leaves the server
  socket.on("disconnect", () => {
    console.log("A user disconnected!");
    //Updates the list of users when a user disconnects from the server
    activeUsers = activeUsers.filter((user) => {
      return user.socketId !== socket.id;
    });
    //Sends the list of users to the client
    io.emit("newUserResponse", activeUsers);
    console.log("active users: ", activeUsers);
    socket.disconnect();
  });
});

// Routes - will move this out of here
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/users", profileRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/chat", chatRoutes);
// Serve static files from the 'images' directory
app.use(express.static("uploads/images"));

// protected endpoint
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Protected endpoint accessed successfully",
    user: req.user,
  });
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = { app, io };
