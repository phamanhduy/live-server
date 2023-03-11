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
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('calculateTime', async (data) =>  {
    try {
      const startTime = new Date();
      if (data?.time === 'start') {
        let dataLive = await liveSession.addSession({
          channel: data?.liver,
          startTime: startTime,
          endTime: moment(startTime).add(data.timeInput, 'seconds'),
          winners: [],
        });
        socket.emit('calculateTime_' + data?.liver, {
          dataLive,
          type: 'add',
        });
      } else if (data?.time === 'end') {
        const listComment = await usersComment.listByTime({
          channel: _.get(data, 'dataLive.channel'),
          createdAt: {
            $gte: _.get(data, 'dataLive.startTime'),
            $lte: _.get(data, 'dataLive.endTime'),
          }
        });

        const dataWinner = getLuckyMember.getMemberLuckyInSession(listComment, data.luckyNumber, data?.viewers);
        await liveSession.updateOne({_id: _.get(data, 'dataLive._id')}, {
          winners: [{
            name: _.get(dataWinner, 'memberLucky.name'),
            channel: _.get(dataWinner, 'memberLucky.channel'),
            username: _.get(dataWinner, 'memberLucky.username'),
            avatar: _.get(dataWinner, 'memberLucky.avatar'),
            comment: _.get(dataWinner, 'memberLucky.comment'),
            viewers: _.get(dataWinner, 'memberLucky.viewers'),
            prize: _.get(dataWinner, 'prize'),
            type: _.get(dataWinner, 'type'),
            prizeNumber: _.get(dataWinner, 'prizeNumber'),
            numberLucky: _.get(dataWinner, 'numberLucky'),
          }],
        });
        socket.emit('calculateTime_' + data?.liver, {
          dataLive: {
            winners: [{
              name: _.get(dataWinner, 'memberLucky.name'),
              channel: _.get(dataWinner, 'memberLucky.channel'),
              username: _.get(dataWinner, 'memberLucky.username'),
              avatar: _.get(dataWinner, 'memberLucky.avatar'),
              comment: _.get(dataWinner, 'memberLucky.comment'),
              viewers: _.get(dataWinner, 'memberLucky.viewers'),
              prize: _.get(dataWinner, 'prize'),
              type: _.get(dataWinner, 'type'),
              prizeNumber: _.get(dataWinner, 'prizeNumber'),
              numberLucky: _.get(dataWinner, 'numberLucky'),
            }],
          },
          type: 'winners',
        });
      } 
    } catch (error) {
      console.log({error})
    }
  })
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});

app.post('/api/setData', (req, res) => {
  try {
    let data = req.body;
    let userData = data.userData;
    if (_.get(data, 'type') === 'follow' || _.get(data, 'type') === 'live') {
      io.emit(data?.liver, {
        ...userData,
        type: data?.type,
      });
      res.send('1');
      return;
    }
    const luckyNumber = getLuckyMember.getLuckyNumberInText(userData?.textMessage || '');
    io.emit(data?.liver, {
      ...userData,
      luckyNumber,
      viewers: data.viewers,
      type: data?.type,
    });

    if (_.get(data, 'type') === 'comment') {
      usersComment.importMessage({
        ...userData,
        channel: data?.liver,
        viewers: data.viewers,
        luckyNumber,
      });
    }

    res.send('1');
  } catch (error) {
    console.log({error})
  }
});

app.get('/api/get-member-random', async (req, res) => {
  try {
    const userRandom = await usersComment.getRamdom();
    res.send(userRandom);
  } catch (error) {
    console.log({error})
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  init();
});
