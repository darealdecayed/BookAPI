import { io } from 'socket.io-client';

// Connect to your backend server running on localhost:3000
export const socket = io('http://localhost:3000', {
  autoConnect: true,
});
