import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  console.log('blog.user:', blog.user)
  console.log('current user:', user)
  
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  return (
    <>
      <div style={{ ...blogStyle, ...hideWhenVisible }}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>

      <div style={{ ...blogStyle, ...showWhenVisible }}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {user && blog.user.id === user.id && (
        <div><button onClick={() => handleRemove(blog)}
           style={{ backgroundColor: "#66b3ff", color: "black" }}
         >remove</button> </div>
        )}
      </div>
    </>
  )
}

export default Blog