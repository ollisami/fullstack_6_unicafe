const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', async () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body.length).toBe(helper.initialBlogs.length)
    })
    
    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const authors = response.body.map(r => r.author)

        expect(authors).toContain(
            'Testi Testaaja'
        )
    })

    test('all blogs have id field', async () => {
        const blogs = await helper.blogsInDb()
        blogs.forEach( blog => {
            expect(blog.id).toBeDefined()
        })
        expect(blogs.length).toBe(helper.initialBlogs.length)
    })

    test('Blog likes is always a positive number', async () => {
        const blogs = await helper.blogsInDb()
        blogs.forEach( blog => {
            expect(blog.likes).toBeGreaterThanOrEqual(0)
        })
        expect(blogs.length).toBe(helper.initialBlogs.length)
    })
})

describe('Adding new blogs', async () => {
    test('a valid blog can be added ', async () => {
        const validUserId = await helper.existingUserId()
        console.log(validUserId)
        const newBlog = {
            title: "Test",
            author: "123",
            url: "test",
            likes: 1,
            userId: validUserId
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain(
        'Test'
        )
    })

    test('Bad request if no title and url', async () => {
        const newBlog = {
            author: "no title and url",
            likes: 1
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
})

describe('Deleting blogs', async () => {
    test('invalid id cannot be deleted', async () => {
        const invalidId = helper.nonExistingId
        await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })

    test('valid id can be deleted', async () => {
        const newBlog = new Blog ({
            title: "Test",
            author: "123",
            url: "test",
            likes: 1
        })
        newBlog.save()

        await api
        .delete(`/api/blogs/${newBlog.id}`)
        .expect(204)
    })
})

describe('Updating blogs', async () => {
    test('invalid id cannot be updated', async () => {
        const newBlog = {
            title: "Test",
            author: "123",
            url: "test",
            likes: 1
        }
        const invalidId = helper.nonExistingId
        await api
        .put(`/api/blogs/${invalidId}`)
        .send(newBlog)
        .expect(400)
    })

    test('valid id can be updated', async () => {
        const newBlog = new Blog ({
            title: "Test",
            author: "123",
            url: "test",
            likes: 1
        })
        newBlog.save()

        newBlog.title  = "updatedTitle"
        newBlog.author = "updatedAuthor"
        newBlog.url    = "updatedUrl"
        newBlog.likes  = 100

        const response = await api
            .put(`/api/blogs/${newBlog.id}`)
            .send(newBlog)

        expect(response.body.title).toBe("updatedTitle")
        expect(response.body.author).toBe("updatedAuthor")
        expect(response.body.url).toBe("updatedUrl")
        expect(response.body.likes).toBe(100)
    })
})

afterAll(() => {
  mongoose.connection.close()
})