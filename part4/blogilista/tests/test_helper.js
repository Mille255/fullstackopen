const Blog = require('../models/blog')

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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}