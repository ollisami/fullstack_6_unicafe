const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs= [
    {
        title: "Test",
        author: "Testi Testaaja",
        url: "test",
        likes: 10
    },
    {
        title: "Matti test",
        author: "Matti Mattinen",
        url: "mattimattinen",
        likes: 1
    },
    {
        title: "test no likes",
        author: "MR no likes",
        url: "likesmissing"
    },
    {
        author: "Title and url missing",
        likes: 1
    },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const existingUserId = async () => {
    const user = new User({ 
        username: 'test',
        name: 'testuser',
        passwordHash: 'test'
    })
    await user.save()
  
    return user._id.toString()
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
    initialBlogs,
    nonExistingId, 
    blogsInDb,
    usersInDb,
    existingUserId
}