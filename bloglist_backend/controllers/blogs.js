const blogsRouter = require('express').Router()
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body =  new Blog(request.body)
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if((!body.title && !body.url) || !user) {
      response.status(400).send({ error: 'title and url missing or no user found'})
      return
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id,
      comments: []
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    console.log(exception.message)
    response.status(400).send({ error: exception.message})
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (user && blog.user && blog.user.toString() === user._id.toString() ) {
      await blog.remove()
      response.status(204).end()
    } else {
      response.status(401).send({ error: 'no authorization' })
    }

  } catch (exception) {
    response.status(400).send({ error: exception.message })
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  try {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user.id,
      comments: body.comments
    }
    console.log(body.comments)
    const updatedBlog = await Blog.findByIdAndUpdate(body.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    console.log(exception.message)
    response.status(400).send({ error: exception.message })
  }
})

module.exports = blogsRouter