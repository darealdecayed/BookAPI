const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { create } = require("node:domain");
require('dotenv').config();

const app = express();
const PORT = 6767;

// Import controllers
const { getCourses, getGrades } = require('./controllers/CourseController');

// Enable CORS for all routes, allow all origins
app.use(cors({
  origin: '*',
  credentials: false
}));
// Middleware
app.use(bodyParser.json());

// Canvas API Routes
app.get('/courses', getCourses);
app.get('/grades/:courseId', getGrades);


// socket.io
const server = createServer(app);
// Mount Socket.IO on the /chat path so clients connect to http://<host>:<port>/chat
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  console.log(`user has connected! socket id=${socket.id} path=${socket.conn?.transport?.name || 'unknown'}`);
   socket.on('disconnect', () => {
    console.log(`user disconnected socket id=${socket.id}`)});
 
    socket.on('foo', (msg) => {
      var data = JSON.parse(msg);

    console.log('message: ' + data['text']);
    socket.emit('foo', JSON.stringify({text: "Hello World!", time: Date.now()}))
  })
    
});


// 🟢 Start server
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
  console.log('socket.io mounted at http://localhost:3000/chat');
});





