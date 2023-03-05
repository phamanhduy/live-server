const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = {
  add,
  importMessage,
  listByTime,
  getMemberRamdom,
  getRamdom,
};

const userCommentSchema = new Schema({
  channel: String,
  name: String,
  username: String,
  avatar: String,
  comment: String,
  numberLucky: Number,
  viewers: String,
}, {
  timestamps: true,
});

const UsersComment = mongoose.model('usersComment', userCommentSchema);

async function add(data) {
  return await UsersComment.create(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function listByTime(query) {
  return await UsersComment.find(query)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function getMemberRamdom() {
  return await UsersComment.find({
    channel: '@thuymoyuum',
  }).then(async (updated) => updated).catch(async (err) => err);
}
// db.myCollection.aggregate([{ $sample: { size: 1 } }])
async function getRamdom() {
  return await UsersComment.aggregate([{ $sample: { size: 1 } }]).then(async (updated) => updated).catch(async (err) => err);
}

async function importMessage(data) {
  const dataInsert = {
    channel: data.channel,
    name: data.userNameElement,
    username: '',
    avatar: data.avatar,
    comment: data.textMessage,
    viewers: data.viewers,
    numberLucky: data.luckyNumber,
  };
  add(dataInsert);
}