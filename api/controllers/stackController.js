const express = require('express')
const reqprom = require('request-promise')
const Stack = require('../models/stackModel')
const router = express.Router()
require('dotenv').config()
const API_KEY = process.env.API_KEY

const thenextweb = 'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=' + API_KEY
const theverge = 'https://newsapi.org/v1/articles?source=the-verge&sortBy=top&apiKey=' + API_KEY
const techradar = 'https://newsapi.org/v1/articles?source=techradar&sortBy=top&apiKey=' + API_KEY
const techcrunch = 'https://newsapi.org/v1/articles?source=techcrunch&sortBy=top&apiKey=' + API_KEY
const recode = 'https://newsapi.org/v1/articles?source=recode&sortBy=top&apiKey=' + API_KEY
const engadget = 'https://newsapi.org/v1/articles?source=engadget&sortBy=top&apiKey=' + API_KEY
const techstack = [thenextweb, theverge, techradar, techcrunch, recode, engadget]

router.get('/tech', function (req, res, next) {
  let promstack = []
  techstack.map(function (value) {
    promstack.push(reqprom.get(value).promise())
  })
  Promise.all(promstack).then(function (value) {
    res.json(value)
  })
})

router.post('/pocket', function (req, res) {
  Stack.find({userId: req.user._doc._id}, (err, stack) => {
    var exist = false
    if (err) return res.send(err)
    if (stack.length > 0) {
      stack[0].pocketStack.map(function (value) {
        if (!exist) {
          if (value.url === req.body.url) {
            exist = true
          }
        }
      })
      if (!exist) {
        stack[0].pocketStack.push(req.body)
        stack[0].save()
        exist = true
      }
      return res.send('Pocketed!')
    } else {
      Stack.create({
        userId: req.user._doc._id
      }, function (err, pocketStack) {
        if (err) return res.send(err)
        pocketStack.pocketStack = req.body
        pocketStack.save()
        res.send('Newly Pocketed!')
      })
    }
  })
})

router.get('/pocket', function (req, res) {
  Stack.find({userId: req.user._doc._id}, (err, pocket) => {
    if (err) return res.send(err)
    return res.json(pocket)
  })
})

router.delete('/pocket', function (req, res) {
  Stack.find({userId: req.user._doc._id}, (err, stack) => {
    if (err) return res.send(err)
    var exist = false
    if (stack.length > 0) {
      stack[0].pocketStack.map(function (value, index) {
        if (!exist) {
          if (value.url === req.body.url) {
            exist = true
            stack[0].pocketStack.splice(index, 1)
            stack[0].save()
          }
        }
      })
    }
    return res.send('Popped!')
  })
})

module.exports = router
