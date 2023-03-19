
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

function updateAvatar (dataLive) {
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
        score: _.get(dataLive, 'score',  20),
        sessionName: _.get(dataLive, 'liveSession', ''),
      };
      await SessionGame.add(sessionWinner);
    } else {
      sessionWinner = {
        channel: _.get(dataLive, 'channel'),
        userId: _.get(user, '_id'),
        score: (_.get(dataLive, 'score',  20)) + _.get(sessionGame, 'score', 20),
        sessionName: _.get(dataLive, 'liveSession', ''),
      };
      await SessionGame.updateData({_id: _.get(sessionGame, '_id')}, sessionWinner);
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
async function addScore({username, name, avatar}, {channel, sessionName, score}, type, socket) {
  let user = await User.findOne({username});
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
      if(_.get(sessionGame, 'followed')) {
        return;
      }
      dataSess['followed'] = true;
    }
    await SessionGame.updateData({_id: _.get(sessionGame, '_id'), sessionName}, dataSess); 
    
    const winner = await SessionGame.getLimitWinner({
      sessionName,
    }, 15);
    socket.emit(`${channel}-ranking`, {
      ranking: winner,
      sessionWinner: null,
    });
  }
}

io.on('connection', (socket) => {
  socket.on('score-winner', (dataLive) => {
    caculatorScore(socket, dataLive)
  });
  
  socket.on('connect-tiktok', ({channel, liveSession}) => {
    tiktokConnector.connectStream(channel, socket, (tiktokLiveConnection) => {
      tiktokLiveConnection.on('like', data => {
        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, {channel, sessionName: liveSession, score: Math.round(data.likeCount / 5)}, 'like', socket)  
      });
      tiktokLiveConnection.on('follow', data => {
        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, {channel, sessionName: liveSession, score: 5}, 'follow', socket);
      });
      tiktokLiveConnection.on('share', data => {
        addScore({
          username: _.get(data, 'uniqueId'),
          name: _.get(data, 'nickname'),
          avatar: _.get(data, 'profilePictureUrl')
        }, {channel, sessionName: liveSession, score: 3}, 'share', socket);
      })

      tiktokLiveConnection.on('chat', data => {
        // console.log(data)
        receivedDataLive({
          channel,
          name: _.get(data, 'nickname'),
          username: _.get(data, 'uniqueId'),
          comment: _.get(data, 'comment'),
          avatar: _.get(data, 'profilePictureUrl'),
          type: 'comment',
        });
      });
      tiktokLiveConnection.on('roomUser', data => {
        receivedDataLive({
          channel,
          viewers: _.get(data, 'viewerCount'),
          type: 'view',
        });
      });
    })
  })
});

// like-bangbang102888 {
//   likeCount: 15,
//   totalLikeCount: 152141,
//   userId: '7077936759234118662',
//   secUid: 'MS4wLjABAAAARIqnfEeM55jPW3ON1WXNacE0SBOlsc5G19ZurCTmjnNw7crbXU27pP9on6stOG8p',
//   uniqueId: 'dangirz1',
//   nickname: 'Dănuț G',
//   profilePictureUrl: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/6b7aa884d15b769d4cf7dea67368105f~c5_100x100.webp?x-expires=1679374800&x-signature=0jVm2BK0htp0%2FBNwyy0oYfMEyTs%3D',
//   followRole: 1,
//   userBadges: [],
//   userDetails: {
//     createTime: '0',
//     bioDescription: '',
//     profilePictureUrls: [
//       'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/6b7aa884d15b769d4cf7dea67368105f~tplv-tiktok-shrink:72:72.webp?x-expires=1679374800&x-signature=waDrGjEfZwMM9L35zIQB9Eea54k%3D',
//       'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/6b7aa884d15b769d4cf7dea67368105f~c5_100x100.webp?x-expires=1679374800&x-signature=0jVm2BK0htp0%2FBNwyy0oYfMEyTs%3D',
//       'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/6b7aa884d15b769d4cf7dea67368105f~c5_100x100.jpeg?x-expires=1679374800&x-signature=trzefb1cuMPhe5t9sIosaLp11Qo%3D'
//     ]
//   },
//   followInfo: {
//     followingCount: 251,
//     followerCount: 240,
//     followStatus: 1,
//     pushStatus: 0
//   },
//   isModerator: false,
//   isNewGifter: false,
//   isSubscriber: false,
//   topGifterRank: null,
//   msgId: '7212130488440359686',
//   createTime: '1679204984401',
//   displayType: 'pm_mt_msg_viewer',
//   label: '{0:user} liked the LIVE'
// }

// share-bangbang102888 {
//   userId: '7087101904496968731',
//   secUid: 'MS4wLjABAAAAVB_WT5y4t3PnbJY_lST8E_VoD7lYUeFcjo9CyFYDei85xTwrIesDTxfZF33ElcHB',
//   uniqueId: 'bosuaoii',
//   nickname: 'Bố sữa ơi',
//   profilePictureUrl: 'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~c5_100x100.webp?x-expires=1679374800&x-signature=ixGLV3%2FepDZO%2FEgQFs0YyJthAVU%3D',
//   followRole: 0,
//   userBadges: [],
//   userDetails: {
//     createTime: '0',
//     bioDescription: '',
//     profilePictureUrls: [
//       'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~tplv-tiktok-shrink:72:72.webp?x-expires=1679374800&x-signature=14DtYcS1A1VBvPeYrXNzheaSZhU%3D',
//       'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~c5_100x100.webp?x-expires=1679374800&x-signature=ixGLV3%2FepDZO%2FEgQFs0YyJthAVU%3D',
//       'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~c5_100x100.jpeg?x-expires=1679374800&x-signature=ZfTQBSk0rvolq1ecXQkgS%2F3SAL8%3D'
//     ]
//   },
//   followInfo: {
//     followingCount: 462,
//     followerCount: 474,
//     followStatus: 0,
//     pushStatus: 0
//   },
//   isModerator: false,
//   isNewGifter: false,
//   isSubscriber: false,
//   topGifterRank: null,
//   msgId: '7212132831835851546',
//   createTime: '1679205529766',
//   displayType: 'pm_mt_guidance_share',
//   label: '{0:user} shared the LIVE'
// }
// follow-bangbang102888 {
//   userId: '7087101904496968731',
//   secUid: 'MS4wLjABAAAAVB_WT5y4t3PnbJY_lST8E_VoD7lYUeFcjo9CyFYDei85xTwrIesDTxfZF33ElcHB',
//   uniqueId: 'bosuaoii',
//   nickname: 'Bố sữa ơi',
//   profilePictureUrl: 'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~c5_100x100.webp?x-expires=1679374800&x-signature=ixGLV3%2FepDZO%2FEgQFs0YyJthAVU%3D',
//   followRole: 1,
//   userBadges: [],
//   userDetails: {
//     createTime: '0',
//     bioDescription: '',
//     profilePictureUrls: [
//       'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~tplv-tiktok-shrink:72:72.webp?x-expires=1679374800&x-signature=14DtYcS1A1VBvPeYrXNzheaSZhU%3D',
//       'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~c5_100x100.webp?x-expires=1679374800&x-signature=ixGLV3%2FepDZO%2FEgQFs0YyJthAVU%3D',
//       'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/25863d9454b40a5e521697249165f728~c5_100x100.jpeg?x-expires=1679374800&x-signature=ZfTQBSk0rvolq1ecXQkgS%2F3SAL8%3D'
//     ]
//   },
//   followInfo: {
//     followingCount: 463,
//     followerCount: 474,
//     followStatus: 1,
//     pushStatus: 0
//   },
//   isModerator: false,
//   isNewGifter: false,
//   isSubscriber: false,
//   topGifterRank: null,
//   msgId: '7212133059808807706',
//   createTime: '1679205582902',
//   displayType: 'pm_main_follow_message_viewer_2',
//   label: '{0:user} followed the host'
// }


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});

app.get('/api/get-ranking', async (req, res) => {
  const session = _.get(req, 'query.session');
  try {
    const winner = await SessionGame.getLimitWinner({sessionName: session }, 15);
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

// tiktokConnector.connectStream('haidangwood16', (tiktokLiveConnection) => {
// tiktokLiveConnection.on('chat', data => {
//   console.log({data})
//   // socket.emit(`chat-${username}`, data);
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


