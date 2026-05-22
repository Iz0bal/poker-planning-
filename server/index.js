const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const TEAM_LABELS = {
  'team-a': 'CrossClient',
  'team-b': 'SelfCare',
};

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// In-memory state: { [teamId]: { users: { [socketId]: { name, vote } }, revealed } }
const rooms = {
  'team-a': { users: {}, revealed: false },
  'team-b': { users: {}, revealed: false },
};

function getRoomUpdate(teamId) {
  const room = rooms[teamId];
  const users = Object.values(room.users).map(({ name, vote }) => ({
    name,
    hasVoted: vote !== null,
    vote: room.revealed ? vote : null,
  }));
  return { users, revealed: room.revealed, teamLabel: TEAM_LABELS[teamId] };
}

function broadcast(teamId) {
  io.to(teamId).emit('room_update', getRoomUpdate(teamId));
}

io.on('connection', (socket) => {
  let currentTeam = null;

  socket.on('join', ({ team, name }) => {
    if (!rooms[team]) return;
    currentTeam = team;
    socket.join(team);
    rooms[team].users[socket.id] = { name, vote: null };
    broadcast(team);
  });

  socket.on('vote', ({ value }) => {
    if (!currentTeam || rooms[currentTeam].revealed) return;
    rooms[currentTeam].users[socket.id].vote = value;
    broadcast(currentTeam);
  });

  socket.on('reveal', () => {
    if (!currentTeam) return;
    rooms[currentTeam].revealed = true;
    broadcast(currentTeam);
  });

  socket.on('reset', () => {
    if (!currentTeam) return;
    const room = rooms[currentTeam];
    room.revealed = false;
    Object.keys(room.users).forEach((id) => {
      room.users[id].vote = null;
    });
    broadcast(currentTeam);
  });

  socket.on('disconnect', () => {
    if (!currentTeam) return;
    delete rooms[currentTeam].users[socket.id];
    broadcast(currentTeam);
  });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
