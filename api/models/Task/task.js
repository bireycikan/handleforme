const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  beginDate: Date,
  location: String
})


module.exports = TaskSchema