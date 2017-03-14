const mongoose = require('mongoose')

var StackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pocketStack: { type: Array }
})

module.exports = mongoose.model('Stack', StackSchema)
