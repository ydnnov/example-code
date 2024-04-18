import { Server } from 'socket.io';
import { fastify } from './fastify.js';

export const websocket = new Server(fastify.server, { cors: { origin: '*' } });
