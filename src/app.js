'use strict';

// ก่อนlanuch express-rate-limit สำหรับป้องกันการยิงรีเควสมากๆ
// Mo

const express = require('express');
const helmet = require('helmet');
const xssFilter = require('x-xss-protection');
const cors = require('cors');

const passport = require('./passport');
const config = require('./utils/config');
const { waitForDBConnection } = require('./utils/mongo');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

require('./models');
const app = express();

// security
app.use(helmet());
app.use(xssFilter());
app.use(cors());

app.use(express.json());
app.use(passport.initialize());

const createServer = async () => {
  await waitForDBConnection;
  console.info('Server Initialized!');

  app.use(
    '/api/users',
    passport.authenticate('userJwt'),
    require('./routes/users')
  );

  const server = app.listen(config.port, () => {
    console.log('Server listening on port' + config.port);
  });

  const io = socketio(server).sockets;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      await jwt.verify(token, config.jwt.secret, { issuer: config.jwt.issuer });
      const jwt_payload = jwt.decode(token);
      jwt_payload.sub;

      socket.userId = jwt_payload.sub;
      next();
    } catch (err) {}
  });

  io.on('connection', (socket) => {
    console.log('Connected: ' + socket.userId);

    socket.on('disconnect', () => {
      console.log('Disconnected: ' + socket.userId);
    });
  });
};

createServer();
