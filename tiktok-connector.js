async function connectStream(username, cb) {
  let tiktokLiveConnection = new WebcastPushConnection(username, {
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

      cb(tiktokLiveConnection);
      // onSocket(socket, username);
  }).catch(err => {
      console.error('Failed to connect', username, {err});
      setTimeout(() => {
        connectStream(username, cb);
      }, 1000);
  });
  // socket.on('disconnect', () => {
  //   console.log('A user disconnected');
  //   tiktokLiveConnection.disconnect();
  // });

}

export {
  connectStream
}

// tiktokLiveConnection.on('chat', data => {
//   socket.emit(`chat-${username}`, data);
// });
// tiktokLiveConnection.on('member', data => {
//   socket.emit(`member-${username}`, data);
// });
// tiktokLiveConnection.on('gift', data => {
//   socket.emit(`gift-${username}`, data);
// })
// tiktokLiveConnection.on('roomUser', data => {
//   socket.emit(`roomUser-${username}`, data);
// })
// tiktokLiveConnection.on('like', data => {
//   socket.emit(`like-${username}`, data);
// })
// tiktokLiveConnection.on('social', data => {
//   socket.emit(`social-${username}`, data);
// })
// tiktokLiveConnection.on('emote', data => {
//   socket.emit(`emote-${username}`, data);
// });
// tiktokLiveConnection.on('envelope', data => {
//   socket.emit(`envelope-${username}`, data);
// })
// tiktokLiveConnection.on('questionNew', data => {
//   socket.emit(`questionNew-${username}`, data);
// })
// tiktokLiveConnection.on('subscribe', data => {
//   socket.emit(`subscribe-${username}`, data);
// })
// tiktokLiveConnection.on('follow', data => {
//   socket.emit(`follow-${username}`, data);
// })
// tiktokLiveConnection.on('share', data => {
//   socket.emit(`share-${username}`, data);
// })