const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const net = require('node:net');
require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Import controllers
const { getCourses, getGrades, getAssignments } = require('./controllers/CourseController');
const { login } = require('./controllers/LoginController');
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
app.post('/api/login', login);
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












// 🟢 Start server with dynamic port selection to avoid EADDRINUSE
function getAvailablePort(startPort, attempts = 20) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    const tryPort = () => {
      if (attempts <= 0) return reject(new Error('No available ports'));
      const tester = net.createServer()
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            attempts -= 1;
            port += 1;
            tryPort();
          } else {
            reject(err);
          }
        })
        .once('listening', () => {
          tester.close(() => resolve(port));
        })
        .listen(port, '0.0.0.0');
    };
    tryPort();
  });
}

(async () => {
  try {
    const chosenPort = await getAvailablePort(PORT);
    server.listen(chosenPort, () => {
      console.log(`server running at http://localhost:${chosenPort}`);
      console.log(`socket.io mounted at http://localhost:${chosenPort}/chat`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message || err);
    process.exit(1);
  }
})();





