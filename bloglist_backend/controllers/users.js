const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs')
    response.json(users.map(u => u.toJSON()))
  })

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.username.length < 3 || body.password.length < 3) {
        response.status(400).send({ error: 'invalid username or password' })
        response.send()
        return
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    response.status(400).send({ error: 'user cration failed' })
  }
})

module.exports = usersRouter