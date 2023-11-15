const mongoose = require('mongoose');
require('./models');

async function init() {
  try {
    const DB_URI = 'mongodb+srv://luongthaivien:luongthaivien@cluster0.4pypokw.mongodb.net/livestream?retryWrites=true&w=majority';
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
