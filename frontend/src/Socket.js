import {io } from 'socket.io-client';
const SOCKET_URL = io('http://localhost:5000');

  const socket = io(SOCKET_URL, {
    withCredentials: true
  });

    export default socket;