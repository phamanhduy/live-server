const { WebcastPushConnection } = require('tiktok-live-connector');

const express = require('express');
const _ = require('lodash');
const moment = require('moment');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const usersComment = require('./models/usersComment');
const liveSession = require('./models/liveSession');
const getLuckyMember = require('./calculate');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.static('client'));
const server = http.createServer(app);

const init = async () => {
  await Promise.all([
    db.init(),
  ]);
}

const io = socketIO(server, {
  cors: {
    origin: 'https://www.tiktok.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});
io.on('connection', (socket) => {

function connectStream(username) {
  let tiktokLiveConnection = new WebcastPushConnection(username);
  // Connect to the chat (await can be used as well)
  tiktokLiveConnection.connect().then(state => {
      console.info(`Connected to roomId ${state.roomId}`);
      socket.emit(`connect-success-${username}`, {
        channel: username,
        status: true,
      })
      // onSocket(socket, username);
  }).catch(err => {
      console.error('Failed to connect', username);
      setTimeout(() => {
        connectStream(username);
      }, 1000);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    tiktokLiveConnection.disconnect();
  });


  tiktokLiveConnection.on('chat', data => {
    socket.emit(`chat-${username}`, data);
  });
  tiktokLiveConnection.on('member', data => {
    socket.emit(`member-${username}`, data);
  });
  tiktokLiveConnection.on('gift', data => {
    socket.emit(`gift-${username}`, data);
  })
  tiktokLiveConnection.on('roomUser', data => {
    socket.emit(`roomUser-${username}`, data);
  })
  tiktokLiveConnection.on('like', data => {
    socket.emit(`like-${username}`, data);
  })
  tiktokLiveConnection.on('social', data => {
    socket.emit(`social-${username}`, data);
  })
  tiktokLiveConnection.on('emote', data => {
    socket.emit(`emote-${username}`, data);
  });
  tiktokLiveConnection.on('envelope', data => {
    socket.emit(`envelope-${username}`, data);
  })
  tiktokLiveConnection.on('questionNew', data => {
    socket.emit(`questionNew-${username}`, data);
  })
  tiktokLiveConnection.on('subscribe', data => {
    socket.emit(`subscribe-${username}`, data);
  })
  tiktokLiveConnection.on('follow', data => {
    socket.emit(`follow-${username}`, data);
  })
  tiktokLiveConnection.on('share', data => {
    socket.emit(`share-${username}`, data);
  })
}
socket.on('connect_user', (username) => {
  connectStream(username);
  // Create a new wrapper object and pass the username
})
});



function onSocket(socket, username) {

}
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});


// app.get('/api/get-member-random', async (req, res) => {
//   try {
//     const userRandom = await usersComment.getRamdom();
//     res.send(userRandom);
//   } catch (error) {
//     console.log({error})
//   }
// });

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  init();
});
