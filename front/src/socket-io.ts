import { io } from 'socket.io-client';

// const URL = `https://rrba.ydnnov.ru`;
const URL = 'http://localhost:5000';

export const socket = io(URL);
