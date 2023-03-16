const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = {
  add,
  findOne,
  listByTime,
  getRamdom,
};

const userSchema = new Schema({
  name: String,
  username: String,
  avatar: String,
}, {
  timestamps: true,
});

const Users = mongoose.model('user', userSchema);

async function add(data) {
  return await Users.create(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function findOne(data) {
  return Users.findOne(data)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function listByTime(query) {
  return await Users.find(query)
    .then(async (updated) => updated).catch(async (err) => err);
}

async function getRamdom() {
  return await Users.aggregate([{ $sample: { size: 1 } }]).then(async (updated) => updated).catch(async (err) => err);
}
