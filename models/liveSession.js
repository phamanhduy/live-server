const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

module.exports = {
  create,
  addSession,
  findOne,
  updateOne,
};

const liveSessionSchema = new Schema({
  channel: String,
  startTime: Date,
  endTime: Date,
  winners: Array
}, {
  timestamps: true,
});

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);

async function create(data) {
  return LiveSession.create(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function updateOne(filter, update, option = {}) {
  return LiveSession.updateOne(filter, update, option)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function findOne(data) {
  return LiveSession.findOne(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function addSession(data) {
  return create(data);
}