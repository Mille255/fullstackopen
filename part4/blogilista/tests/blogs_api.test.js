const assert = require('node:assert')
const { test, after, beforeEach  } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('returned blogs contain id field', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  for (const blog of blogs) {
    assert.ok(blog.id, 'Blogilla has id-field')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id-fields')
  } 
  
})


test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Kolmas kurjuus",
    author: "Heikki Ojanperä",
    url: "www.Hipera.fi",
    likes: 11,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('Kolmas kurjuus'))
})

after(async () => {
  await mongoose.connection.close()
})