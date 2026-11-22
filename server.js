const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_, res) => res.json({ ok: true, game: 'CAR RACING SIMULATOR' }));

const rooms = new Map();
io.on('connection', socket => {
  socket.on('join', ({ room, name, car }) => {
    room = String(room || 'RACE').slice(0, 16);
    name = String(name || 'Driver').slice(0, 18);
    car = String(car || 'Thunder GT').slice(0, 24);
    socket.join(room);
    socket.data.room = room;
    socket.data.player = { id: socket.id, name, car, x: 0, lane: 0, score: 0 };
    if (!rooms.has(room)) rooms.set(room, new Map());
    rooms.get(room).set(socket.id, socket.data.player);
    io.to(room).emit('players', [...rooms.get(room).values()]);
  });
  socket.on('state', state => {
    const room = socket.data.room;
    if (!room || !rooms.has(room)) return;
    const p = rooms.get(room).get(socket.id);
    if (!p) return;
    p.x = Number(state.x) || 0;
    p.lane = Number(state.lane) || 0;
    p.score = Number(state.score) || 0;
    socket.to(room).emit('players', [...rooms.get(room).values()]);
  });
  socket.on('disconnect', () => {
    const room = socket.data.room;
    if (!room || !rooms.has(room)) return;
    rooms.get(room).delete(socket.id);
    io.to(room).emit('players', [...rooms.get(room).values()]);
    if (!rooms.get(room).size) rooms.delete(room);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => console.log(`Game running on ${port}`));
