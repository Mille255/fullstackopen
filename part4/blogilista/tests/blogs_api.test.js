const assert = require('node:assert')
const { test, after, beforeEach  } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: "Uuusi juttu",
    author: "Kalle Päätalo",
    url: "www.tal.fi",
    likes: 9,
  },
  {
    title: "Toinen tarina",
    author: "Jussi Kujala",
    url: "www.jkujala.fi",
    likes: 7,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
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

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('returned blogs contain id field', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  for (const blog of blogs) {
    assert.ok(blog.id, 'Blogilla has id-field')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id-fields')
  } 
  
})

after(async () => {
  await mongoose.connection.close()
})