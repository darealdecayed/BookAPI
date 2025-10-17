const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { create } = require("node:domain");
require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Import controllers
const { getCourses, getGrades, getAssignments } = require('./controllers/CourseController');
const { askAI } = require('./controllers/AIController');

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
app.get('/courses/:courseId/assignments', getAssignments);
app.post('/ai/ask', askAI);


// socket.io
const server = createServer(app);
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
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
  console.log(`socket.io mounted at http://localhost:${PORT}/chat`);
});





