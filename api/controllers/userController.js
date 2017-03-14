var express = require('express')
var User = require('../models/userModel')
var router = express.Router()

router.get('/', function (req, res) {
  User.findById(req.user._doc._id, function (err, user) {
    if (err) return res.send({message: 'An error occurred when finding users'})
    res.json(user)
  })
})

router.post('/', function (req, res) {
  var user = new User(req.body)
  user.save(function (err) {
    if (err) return res.send({message: 'An error occurred when creating a user'})
    res.json(user)
  })
})

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.send({message: 'No user found'})
    res.json(user)
  })
})

module.exports = router
