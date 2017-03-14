const express = require('express')
const Stack = require('../controllers/stackController')
const app = express()

app.route('/stacks')
  .get(Stack.list_all_stacks)
  .post(Stack.add_new_stack)

app.route('/stacks/:id')
  .get(Stack.read_a_stack)
  .put(Stack.update_a_stack)
  .delete(Stack.remove_a_stack)
