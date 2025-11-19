import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable  from './components/Togglable'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{message}</div>;
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    blogService
    .getAll()
    .then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes) // eniten likes ensin
    setBlogs(sortedBlogs)
    }
     
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogsUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessageType('error');
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogsUser') // jos käytät localStoragea
  setUser(null)
}

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setMessageType('success');
      setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
      setErrorMessage(null)
        }, 4000)
    }
    ).catch(() => {
      setMessageType('error');
      setErrorMessage('error adding blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })  
  }

  const handleLike = async (blog) => {
    const updatedBlog = { 
      ...blog, 
      likes: blog.likes + 1 
    }

    const returnedBlog = await
      blogService
      .updateBlog(blog.id, updatedBlog) 
    setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }
   

  const loginForm = () => (
  <>
    <h2>Log in to application</h2>
      <Notification message={errorMessage} type={messageType} />
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
   
  </>
  )

  const blogslist = () => {

  return   (
  
  <div>
    <h2>Blogs</h2>
    <Notification message={errorMessage} type={messageType} />
     {user && (
      <div>
        <p>{user.name} logged in 
          <button onClick={handleLogout}>logout</button>
        </p>
      </div>
    )}
     <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
    <br />
    {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike}/>
      )}
    </div>
  )}

  return (
    <div>
      <h1>Blogs</h1>
      {!user && loginForm()}
      {user && blogslist()}
    </div>
  )
}


export default App