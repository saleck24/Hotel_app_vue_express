import { io } from 'socket.io-client';

const URL = 'http://localhost:3000'; // Backend URL

export const socket = io(URL, {
    autoConnect: false,
    withCredentials: true
});

socket.on('connect_error', (err) => {
    console.error('Socket Connection Error:', err.message);
});

// For debugging
socket.onAny((event, ...args) => {
    console.log(`Socket Event: ${event}`, args);
});
