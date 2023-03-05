const mongoose = require('mongoose');
require('./models');

async function init() {
  try {
    const DB_URI = 'mongodb://127.0.0.1:27017/livestream';
    await mongoose.connect(DB_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected'))
  } catch (error) {
    _logError(error);
  }
}

async function stop() {
  return new Promise(resolve => {
    try {
      mongoose.disconnect(() => {
        resolve();
      });
    } catch (error) {
      resolve();
    }
  });
}

function _logError(err) {
  // eslint-disable-next-line
  console.log('CONNECT DB IS FAIL', err);
}
exports.init = init;
exports.stop = stop;
