import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)

  const blogFormref = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notificationType = (message, type='successful') => {
    setMessage({ message, type })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (ex) {
      notificationType('wrong username or password', 'error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>

      <Notification message={message} />

      <Togglable buttonLabel="log in">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    </div>
  )

  const logout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedUser')

    setUser(null)
  }

  const updateBlog = async (blog) => {
    await blogService.update(blog)

    const updatedBlog = { ...blog }

    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
  }

  const removeBlog = async (blog) => {
    await blogService.remove(blog)

    setBlogs(blogs.filter(obj => obj.id !== blog.id))
  }

  const addBlog = (blogObj) => {
    blogFormref.current.toggleVisibility()
    blogService
      .create(blogObj)
      .then(returnedBlog => {
        notificationType(`a new blog ${blogObj.title} by ${blogObj.author} added`)
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  if (user === null) {
    return(
      loginForm()
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in {<button onClick={logout}>logout</button>}</p>

      <Togglable buttonLabel="create new blog" ref={blogFormref}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs
        .sort((x, y) => x.likes - y.likes)
        .map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />
        )}
    </div>
  )
}

export default App