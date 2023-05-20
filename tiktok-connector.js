const { WebcastPushConnection } = require('tiktok-live-connector');
async function connectStream(channel, socket, cb) {
  let tiktokLiveConnection = new WebcastPushConnection(channel, {
    processInitialData: false,
    enableExtendedGiftInfo: true,
    enableWebsocketUpgrade: true,
    requestPollingIntervalMs: 2000,
    clientParams: {
        "app_language": "en-US",
        "device_platform": "web"
    },
    requestHeaders: {
        "headerName": "headerValue"
    },
    websocketHeaders: {
        "headerName": "headerValue"
    },
    requestOptions: {
        timeout: 10000
    },
    websocketOptions: {
        timeout: 10000
    }
  });
  // Connect to the chat (await can be used as well)
  tiktokLiveConnection.connect().then(state => {
      console.info(`Connected to roomId ${state.roomId}`);
      socket.emit(`connect-success-${channel}`, '');
      cb(tiktokLiveConnection, socket);
  }).catch(err => {
      console.error('Lỗi khi kết nối ', channel, {err});
      setTimeout(() => {
        connectStream(channel, socket, cb);
      }, 1000);
  });
  socket.on(`dis-connect-${channel}`, () => {
    console.log('dis', channel)
    tiktokLiveConnection.disconnect();
  });
  tiktokLiveConnection.on('disconnected', () => {
    console.error('Đã ngắt kết nối ', channel);
    socket.emit(`disconnect-${channel}`, '');
  });
}

module.exports = {
  connectStream
};
// tiktokLiveConnection.on('chat', data => {
//   socket.emit(`chat-${channel}`, data);
// });
// tiktokLiveConnection.on('member', data => {
//   socket.emit(`member-${channel}`, data);
// });
// tiktokLiveConnection.on('gift', data => {
//   socket.emit(`gift-${channel}`, data);
// })
// tiktokLiveConnection.on('roomUser', data => {
//   socket.emit(`roomUser-${channel}`, data);
// })
// tiktokLiveConnection.on('like', data => {
//   socket.emit(`like-${channel}`, data);
// })
// tiktokLiveConnection.on('social', data => {
//   socket.emit(`social-${channel}`, data);
// })
// tiktokLiveConnection.on('emote', data => {
//   socket.emit(`emote-${channel}`, data);
// });
// tiktokLiveConnection.on('envelope', data => {
//   socket.emit(`envelope-${channel}`, data);
// })
// tiktokLiveConnection.on('questionNew', data => {
//   socket.emit(`questionNew-${channel}`, data);
// })
// tiktokLiveConnection.on('subscribe', data => {
//   socket.emit(`subscribe-${channel}`, data);
// })
// tiktokLiveConnection.on('follow', data => {
//   socket.emit(`follow-${channel}`, data);
// })
// tiktokLiveConnection.on('share', data => {
//   socket.emit(`share-${channel}`, data);
// })