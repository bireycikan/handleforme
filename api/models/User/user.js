const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  fullname: String,
  email: { type: String, unique: true },
  phone: String,
  pass: String,
  imagepath: String
})

module.exports = UserSchema