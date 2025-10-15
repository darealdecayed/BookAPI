const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const bookController = require("./controllers/bookController");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { create } = require("node:domain");


const app = express();
const PORT = 6767;

// Enable CORS for all routes, allow frontend origin
app.use(cors({
  origin: [
    "https://supreme-space-cod-7v4pjqw57j95h4xg-3000.app.github.dev",
    "https://supreme-space-cod-7v4pjqw57j95h4xg-3001.app.github.dev",
    "https://supreme-space-cod-7v4pjqw57j95h4xg-3002.app.github.dev",
    "https://supreme-space-cod-7v4pjqw57j95h4xg-3003.app.github.dev",
    "https://supreme-space-cod-7v4pjqw57j95h4xg-3004.app.github.dev",
    "http://localhost:3000"
  ],
  credentials: true
}));
// Middleware
app.use(bodyParser.json());

// Book routes using controller
app.post("/book", bookController.createBook);
app.get("/book/:id", bookController.getBook);
app.put("/book/:id", bookController.updateBook);
app.delete("/book/:id", bookController.deleteBook);

// socket.io
const server = createServer(app);
// Mount Socket.IO on the /chat path so clients connect to http://<host>:<port>/chat
const io = new Server(server, {
  path: '/chat'
});

io.on("connection", (socket) => {
  console.log(`user has connected! socket id=${socket.id} path=${socket.conn?.transport?.name || 'unknown'}`);
   socket.on('disconnect', () => {
    console.log(`user disconnected socket id=${socket.id}`)});

    socket.on('chat message', (msg) => {
    console.log('message: ' + msg);})
});


// 🟢 Start server
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
  console.log('socket.io mounted at http://localhost:3000/chat');
});





