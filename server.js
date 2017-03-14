const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()
const User = require('./api/models/userModel')
const app = express()
const SECRET = process.env.SECRET

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mylittlenewsstack')
mongoose.Promise = global.Promise
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
})

app.use('/api/users', expressJWT({
  secret: SECRET,
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring (req, res) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  }
}).unless({method: 'POST'}), require('./api/controllers/userController'))

app.use('/api/stacks', expressJWT({secret: SECRET}), require('./api/controllers/stackController'))
app.post('/api/auth', function (req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err || !user) return res.json(err)
    user.authenticated(req.body.password, function (err, result) {
      if (err || !result) return res.json(err)
      let token = jwt.sign(user, SECRET)
      res.json({user: user, token: token})
    })
  })
})
app.listen(process.env.PORT || 3000)
