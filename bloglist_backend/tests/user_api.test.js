const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)


describe('when there is initially one user at db', async () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Testi testaaja',
      password: 'paasword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with a used username', async () => {
    const firstUser = {
        username: 'test',
        name: 'Testi testaaja',
        password: 'paasword',
      }
  
      await api
        .post('/api/users')
        .send(firstUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const secondUser = {
      username: 'test',
      name: 'Toinen testaaja',
      password: 'qwert123',
    }

    await api
      .post('/api/users')
      .send(secondUser)
      .expect(400)
  })

  test('creation fails with too short username', async () => {
    const newUser = {
        username: 'te',
        name: 'Testi testaaja',
        password: 'paasword',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
  })

  test('creation fails with too short password', async () => {
    const newUser = {
        username: 'test',
        name: 'Testi testaaja',
        password: 'pa',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
  })
})

afterAll(() => {
    mongoose.connection.close()
})