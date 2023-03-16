const { WebcastPushConnection } = require('tiktok-live-connector');

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

async function caculatorScore(socket, dataLive) {
  try {
    let user = await User.findOne({
      name: _.get(dataLive, 'name'),
      username: _.get(dataLive, 'username', ''),
      avatar: _.get(dataLive, 'avatar'),
    });

    if (!user) {
      user = await User.add({
        name: _.get(dataLive, 'name', ''),
        username: _.get(dataLive, 'username', ''),
        avatar: _.get(dataLive, 'avatar', ''),
      });
    }
 
    let sessionGame = await SessionGame.findOne({userId: new mongoose.Types.ObjectId(_.get(user, '_id'))});
    if (!sessionGame) {
      await SessionGame.add({
        channel: _.get(dataLive, 'channel'),
        userId: _.get(user, '_id'),
        score: _.get(dataLive, 'score',  20),
        sessionName: _.get(dataLive, 'sessionName', 'datatest'),
      });
    } else {
      await SessionGame.updateData({
        channel: _.get(dataLive, 'channel'),
        userId: _.get(user, '_id'),
        score: (_.get(dataLive, 'score',  20)) + _.get(sessionGame, 'score', 20),
        sessionName: _.get(dataLive, 'sessionName', 'datatest'),
      });
    }

    const winner = await SessionGame.getLimitWinner({sessionName: 'datatest'});
    socket.emit(`${_.get(dataLive, 'channel')}-ranking`, winner);
  } catch (error) {
    console.log(error)
  }
}

io.on('connection', (socket) => {
  socket.on('score-winner', (dataLive) => {
    caculatorScore(socket, dataLive)
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});

app.get('/api/get-ranking', async (req, res) => {
  const session = _.get(req, 'query.session');
  try {
    const winner = await SessionGame.getLimitWinner({sessionName: session});
    res.send(winner);
  } catch (error) {
    console.log({error})
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

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  init();
});
