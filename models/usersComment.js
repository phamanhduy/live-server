const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = {
  add,
  importMessage,
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


async function importMessage(data) {
  const dataInsert = {
    channel: data.channel,
    name: data.userNameElement,
    username: '',
    avatar: data.avatar,
    comment: data.textComment,
    viewers: data.viewers,
  };
  add(dataInsert);
}