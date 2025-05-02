import {io} from 'socket.io-client';

export const socket = io('http://localhost:5000');

export const joinNotificationRoom = userId => {
  if (userId) socket.emit('join', userId);
};
