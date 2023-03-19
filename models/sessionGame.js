const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = {
  getLimitWinner,
  updateData,
  findOne,
  add,
  getRamdom,
};

const sessionGameSchema = new Schema({
  userId: ObjectId,
  channel: String,
  sessionName: String,
  score: Number,
  followed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const SessionGame = mongoose.model('sessionGame', sessionGameSchema);

async function add(data) {
  return await SessionGame.create(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function updateData(filter, data) {
  return await SessionGame.updateOne(filter, data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function findOne(data) {
  return SessionGame.findOne(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function getLimitWinner(filter, limit = 5) {
  return SessionGame.aggregate([{
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $match: filter,
    },
    {
      $sort: { score: -1 },
    },
    {
      $limit: limit,
    },
  ]).then((sessions, err) => {
    if (err) {
      console.error(err);
      return;
    }
    return sessions;
  });
}
async function getRamdom() {
  return await SessionGame.aggregate([{ $sample: { size: 1 } }]).then(async (updated) => updated).catch(async (err) => err);
}
