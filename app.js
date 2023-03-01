const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const db = require('./db');
const usersComment = require('./models/usersComment');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.static('client'));
const server = http.createServer(app);

const init = async () => {
  await Promise.all([
    db.init(),
  ]);
}

const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/livetream.html');
});

app.post('/api/setData', (req, res) => {
  let data = req.body;
  let userData = data.userData;
  const arrayHref = data.location.split('/');
  // console.log({data})
  io.emit(arrayHref[3], data);
  usersComment.importMessage({
    ...userData,
    channel: arrayHref[3],
    viewers: data.viewers
  })
  res.send('User created successfully');
  // fs.exists(`./data/${arrayHref[3]}.json`, function(exists) {
  //   fs.writeFileSync(`./data/${arrayHref[3]}.json`, JSON.stringify(data));
  // });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  init();
});
