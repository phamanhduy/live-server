const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const usersComment = require('./models/usersComment');
const liveSession = require('./models/liveSession');
const User = require('./models/user');
const SessionGame = require('./models/sessionGame');
const FunctionUtil = require('./function');
const tiktokConnector = require('./tiktok-connector');
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

function updateAvatar(dataLive) {
  const checkTimeExpireImage = FunctionUtil.checkTimeExpire(_.get(dataLive, 'avatar'));
  if (!checkTimeExpireImage) {
    User.updateData({
      name: _.get(dataLive, 'name', ''),
      username: _.get(dataLive, 'username', ''),
      // avatarBase64: base64Img,
    }, {
      avatar: _.get(dataLive, 'avatar', ''),
    });
  }
}
async function caculatorScore(socket, dataLive) {
  try {
    // const base64Img = await FunctionUtil.imageToBase64(_.get(dataLive, 'avatar'));
    let user = await User.findOne({
      name: _.get(dataLive, 'name'),
      username: _.get(dataLive, 'username', ''),
      // avatarBase64: base64Img,
    });
    if (!user) {
      user = await User.add({
        name: _.get(dataLive, 'name', ''),
        username: _.get(dataLive, 'username', ''),
        avatar: _.get(dataLive, 'avatar', ''),
        // avatarBase64: base64Img,
      });
    }
    updateAvatar(dataLive);
    let sessionGame = await SessionGame.findOne({
      userId: (new mongoose.Types.ObjectId(_.get(user, '_id'))),
      sessionName: _.get(dataLive, 'liveSession', ''),
    });
    let sessionWinner = null;
    if (!sessionGame) {
      sessionWinner = {
        channel: _.get(dataLive, 'channel'),
        userId: _.get(user, '_id'),
        score: _.get(dataLive, 'score', 20),
        sessionName: _.get(dataLive, 'liveSession', ''),
      };
      await SessionGame.add(sessionWinner);
    } else {
      sessionWinner = {
        channel: _.get(dataLive, 'channel'),
        userId: _.get(user, '_id'),
        score: (_.get(dataLive, 'score', 20)) + _.get(sessionGame, 'score', 20),
        sessionName: _.get(dataLive, 'liveSession', ''),
      };
      await SessionGame.updateData({ _id: _.get(sessionGame, '_id') }, sessionWinner);
    }

    const winner = await SessionGame.getLimitWinner({
      sessionName: _.get(dataLive, 'liveSession', '')
    }, 15);
    // console.log({dataLive, winner})
    socket.emit(`${_.get(dataLive, 'channel')}-ranking`, {
      ranking: winner,
      sessionWinner,
    });
  } catch (error) {
    console.log(error)
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
    await SessionGame.add({
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
    await SessionGame.updateData({ _id: _.get(sessionGame, '_id'), sessionName }, dataSess, async (data) => {
      console.log({ data })
      const winner = await SessionGame.getLimitWinner({
        sessionName,
      }, 15);
      socket.emit(`${channel}-ranking`, {
        ranking: winner,
        sessionWinner: null,
      });
    });
  }
}
let tiktokLiveConnectionServer = null;
let channelServer = null;
let liveSessionServer = null;
io.on('connection', (socket) => {
  socket.on('score-winner', (dataLive) => {
    caculatorScore(socket, dataLive)
  });

  socket.on('connect-tiktok', ({ channel, liveSession }) => {
    tiktokConnector.connectStream(channel, socket, (tiktokLiveConnection) => {
      tiktokLiveConnectionServer = tiktokLiveConnection;
      channelServer = channel;
      liveSessionServer = liveSession;
      connectWithSocket(tiktokLiveConnection, channel, liveSession);
    })
  });

  connectWithSocket(tiktokLiveConnectionServer, channelServer, liveSessionServer);
  function connectWithSocket(titokCon, channel, liveSession) {
    if (titokCon) {
      console.log('reload');
      titokCon.on('like', data => {
        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, { channel: channel, sessionName: liveSession, score: Math.round(data.likeCount / 8) }, 'like', socket)
      });
      titokCon.on('follow', data => {
        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, { channel: channel, sessionName: liveSession, score: 20 }, 'follow', socket);
      });
      titokCon.on('share', data => {
        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, { channel: channel, sessionName: liveSession, score: 3 }, 'share', socket);
      })

      titokCon.on('chat', data => {
        receivedDataLive({
          channel: channel,
          name: _.get(data, 'nickname'),
          username: _.get(data, 'uniqueId'),
          comment: _.get(data, 'comment'),
          avatar: _.get(data, 'profilePictureUrl'),
          type: 'comment',
        });

        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, { channel: channel, sessionName: liveSession, score: 1 }, 'comment', socket);
      });
      titokCon.on('roomUser', data => {
        receivedDataLive({
          channel: channel,
          viewers: _.get(data, 'viewerCount'),
          type: 'view',
        });
      });
    }
  }

});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});

app.get('/api/get-ranking', async (req, res) => {
  const session = _.get(req, 'query.session');
  try {
    const winner = await SessionGame.getLimitWinner({ sessionName: session }, 15);
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