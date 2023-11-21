require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./connectionWrapper');
const { clientBlocked } = require('./limiter');

const db = require('./db');
const usersComment = require('./models/usersComment');
const liveSession = require('./models/liveSession');
const User = require('./models/user');
const SessionGame = require('./models/sessionGame');
const FunctionUtil = require('./function');
// const tiktokConnector = require('./tiktok-connector');
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
  let tiktokConnectionWrapper;

  console.info('New connection from origin', socket.handshake.headers['origin'] || socket.handshake.headers['referer']);

  socket.on('setUniqueId', (uniqueId, options) => {
      // Prohibit the client from specifying these options (for security reasons)
      if (typeof options === 'object' && options) {
          delete options.requestOptions;
          delete options.websocketOptions;
      } else {
          options = {};
      }

      // Session ID in .env file is optional
      if (process.env.SESSIONID) {
          options.sessionId = process.env.SESSIONID;
          console.info('Using SessionId');
      }

      // Check if rate limit exceeded
      if (process.env.ENABLE_RATE_LIMIT && clientBlocked(io, socket)) {
          socket.emit('tiktokDisconnected', 'You have opened too many connections or made too many connection requests. Please reduce the number of connections/requests or host your own server instance. The connections are limited to avoid that the server IP gets blocked by TokTok.');
          return;
      }

      // Connect to the given username (uniqueId)
      try {
          tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
          tiktokConnectionWrapper.connect();
      } catch (err) {
          socket.emit('tiktokDisconnected', err.toString());
          return;
      }

      // Redirect wrapper control events once
      tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
      tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

      // Notify client when stream ends
      tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));

      // Redirect message events
      tiktokConnectionWrapper.connection.on('roomUser', msg => socketReceiveMessage('roomUser', msg, options, socket));
      tiktokConnectionWrapper.connection.on('member', msg => socketReceiveMessage('member', msg, options, socket));
      tiktokConnectionWrapper.connection.on('chat', msg => socketReceiveMessage('chat', msg, options, socket));
      tiktokConnectionWrapper.connection.on('gift', msg => socketReceiveMessage('gift', msg, options, socket));
      tiktokConnectionWrapper.connection.on('social', msg => socketReceiveMessage('social', msg, options, socket));
      tiktokConnectionWrapper.connection.on('like', msg => socketReceiveMessage('like', msg, options, socket));
      tiktokConnectionWrapper.connection.on('questionNew', msg => socketReceiveMessage('questionNew', msg, options, socket));
      tiktokConnectionWrapper.connection.on('linkMicBattle', msg => socketReceiveMessage('linkMicBattle', msg, options, socket));
      tiktokConnectionWrapper.connection.on('linkMicArmies', msg => socketReceiveMessage('linkMicArmies', msg, options, socket));
      tiktokConnectionWrapper.connection.on('liveIntro', msg => socketReceiveMessage('liveIntro', msg, options, socket));
      tiktokConnectionWrapper.connection.on('emote', msg => socketReceiveMessage('emote', msg, options, socket));
      tiktokConnectionWrapper.connection.on('envelope', msg => socketReceiveMessage('envelope', msg, options, socket));
      tiktokConnectionWrapper.connection.on('subscribe', msg => socketReceiveMessage('subscribe', msg, options, socket));
  });


  socket.on('send_coin', async (data) => {
    let sessionName = _.get(data, 'userData.liveSession');
    let user = await User.findOne({ username: _.get(data, 'winner.username')});
    let sessionGame = await SessionGame.findOne({
      userId: (new mongoose.Types.ObjectId(_.get(user, '_id'))),
      sessionName,
    });
    let dataSess = {
      score: parseInt(_.get(data, 'coinReceived')) + _.get(sessionGame, 'score'),
    }
    await SessionGame.updateData({ _id: _.get(sessionGame, '_id'), sessionName }, dataSess, async (data) => {
      const winner = await SessionGame.getLimitWinner({
        sessionName,
      }, 30);
      socket.emit(`${_.get(data, 'userData.channel')}-ranking`, {
        ranking: winner,
        sessionWinner: null,
      });
    });
  });

  socket.on('disconnect', () => {
      if (tiktokConnectionWrapper) {
          tiktokConnectionWrapper.disconnect();
      }
  });
});

function socketReceiveMessage(type, data, options, socket) {
  if (type === 'chat') {
    socket.emit(`${_.get(options, 'channel')}-chat`, data);
  } else if (type === 'like') {
    socket.emit(`${_.get(options, 'channel')}-like`, data);
  } else if (type === 'roomUser') {
    socket.emit(`${_.get(options, 'channel')}-views`, data);
  }
  switch (type) {
    case 'like':
      addScore({
        username: _.get(data, 'uniqueId'),
        name: _.get(data, 'nickname'),
        avatar: _.get(data, 'profilePictureUrl')
      }, { channel: _.get(options, 'channel'), sessionName: _.get(options, 'liveSession'), score: Math.round(data.likeCount / 100) }, 'like', socket)
      break;
    case 'follow':
      addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
      }, { channel: _.get(options, 'channel'), sessionName: _.get(options, 'liveSession'), score: 5 }, 'follow', socket);
      break;
    case 'share':
      addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
      }, { channel: _.get(options, 'channel'), sessionName: _.get(options, 'liveSession'), score: 1 }, 'share', socket);
      break;
    case 'member':
      addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
      }, { channel: _.get(options, 'channel'), sessionName: _.get(options, 'liveSession'), score: 1 }, 'member', socket);
      break;
    case 'gift':
      addScore({
        username: _.get(data, 'uniqueId'),
        name: _.get(data, 'nickname'),
        avatar: _.get(data, 'profilePictureUrl')
      }, { channel: _.get(options, 'channel'), sessionName: _.get(options, 'liveSession'), score: data.diamondCount }, 'gift', socket)
      break;
    default:
      break;
  }
}

async function addScore({ username, name, avatar }, { channel, sessionName, score }, type, socket) {
  let user = await User.findOne({ username });
  if (!user) {
    user = await User.add({
      name, username, avatar,
    });
  }
  let sessionGame = await SessionGame.findOne({
    userId: (new mongoose.Types.ObjectId(_.get(user, '_id'))),
    sessionName,
  });
  if (!sessionGame) {
    sessionGame = await SessionGame.add({
      channel, userId: _.get(user, '_id'),
      score,
      sessionName,
    });
  } else {
    let dataSess = {
      score: score + _.get(sessionGame, 'score'),
    }
    if (type === 'follow') {
      if (_.get(sessionGame, 'followed')) {
        return;
      }
      dataSess['followed'] = true;
    }
    if (type === 'member') {
      if (_.get(sessionGame, 'isMember')) {
        return;
      }
      dataSess['isMember'] = true;
    }
    await SessionGame.updateData({ _id: _.get(sessionGame, '_id'), sessionName }, dataSess, async (data) => {});
  }
  console.log({username, type, score})
  const winner = await SessionGame.getLimitWinner({
    sessionName,
  }, 30);
  socket.emit(`${channel}-ranking`, {
    ranking: winner,
    sessionWinner: null,
  });
}
// Emit global connection statistics
setInterval(() => {
  io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
}, 5000)

// function updateAvatar(dataLive) {
//   const checkTimeExpireImage = FunctionUtil.checkTimeExpire(_.get(dataLive, 'avatar'));
//   if (!checkTimeExpireImage) {
//     User.updateData({
//       name: _.get(dataLive, 'name', ''),
//       username: _.get(dataLive, 'username', ''),
//       // avatarBase64: base64Img,
//     }, {
//       avatar: _.get(dataLive, 'avatar', ''),
//     });
//   }
// }



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});

app.get('/to', (req, res) => {
  res.sendFile(__dirname + '/client/to.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/client/chat.html');
});


app.get('/setting', (req, res) => {
  res.sendFile(__dirname + '/client/setting.html');
});
app.get('/api/get-ranking', async (req, res) => {
  const session = _.get(req, 'query.session');
  try {
    const winner = await SessionGame.getLimitWinner({ sessionName: session }, 30);
    res.send(winner);
  } catch (error) {
    console.log({ error })
  }
});

app.post('/api/setData', (req, res) => {
  try {
    const data = _.get(req, 'body');
    if (_.get(data, 'type') === 'follow' || _.get(data, 'type') === 'live' || _.get(data, 'type') === 'comment') {
      receivedDataLive({
        channel: _.get(data, 'liver', '').substring(1),
        name: _.get(data, 'userData.userNameElement'),
        comment: _.get(data, 'userData.textMessage'),
        avatar: _.get(data, 'userData.avatar'),
        type: _.get(data, 'type'),
      });
      res.send(true);
      return;
    } else if (_.get(data, 'type') === 'view') {
      receivedDataLive({
        channel: _.get(data, 'liver', '').substring(1),
        viewers: _.get(data, 'viewers'),
        type: _.get(data, 'type'),
      });
    }

    res.send('1');
  } catch (error) {
    console.log({ error })
  }
});

// tiktokConnector.connectStream('haidangwood16', (tiktokLiveConnection) => {
// tiktokLiveConnection.on('chat', data => {
//   console.log({data})
//   // socket.emit(chat-${username}, data);
// });
// })

function receivedDataLive(dataLive) {
  io.emit(_.get(dataLive, 'channel'), dataLive);
}
// app.get('/api/get-member-random', async (req, res) => {
//   try {
//     const userRandom = await usersComment.getRamdom();
//     res.send(userRandom);
//   } catch (error) {
//     console.log({error})
//   }
// });
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  init();
});