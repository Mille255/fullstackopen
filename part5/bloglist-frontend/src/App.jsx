import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
  const handleBlogSubmit = async event => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    } 
    const createdBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(createdBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    setMessageType('success');
    setErrorMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
      setErrorMessage(null)
        }, 4000)
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

  const blogslist = () => (
  <>
    <h2>Blogs</h2>
     <Notification message={errorMessage} type={messageType} />
     {user && (
      <div>
        <p>{user.name} logged in 
          <button onClick={handleLogout}>logout</button>
        </p>
      </div>
    )}
    <h2>create new</h2>
    <form onSubmit={handleBlogSubmit }>
      <div> 
        <label>
          title: 
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div> 
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div> 
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
    <button type="submit">create</button>
    </form>
    {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )

  return (
    <div>
      <h1>Blogs</h1>
      {!user && loginForm()}
      {user && blogslist()}
    </div>
  )
}


export default App