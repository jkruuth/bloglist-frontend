import React, { useState } from 'react'

const Details = ({ blog, handleBlogLike, handleBlogRemove }) => {

  const buttonStyle = {
    backgroundColor: 'DodgerBlue',
  }

  const handleLike = () => {
    handleBlogLike(blog)
    blog.likes += 1
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      handleBlogRemove(blog)
    }
  }

  return (
    <div className="blogs">
      <div className="details">
        <p>{blog.url}</p>
        <p className="likes">likes {blog.likes} {<button onClick={handleLike}>like</button>}</p>
        <p>{blog.user ? blog.user.username : 'undefined'}</p>
        <button style={buttonStyle} onClick={handleRemove}>remove</button>
      </div>
    </div>
  )
}

const Blog = ({ blog, updateBlog, removeBlog }) => {

  const [visibleDetails, setVisibleDetails] = useState(false)
  const detailsButton = visibleDetails ? 'hide' : 'view'
  const toggleVisibility = () => {
    setVisibleDetails(!visibleDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div id='blogs' style={blogStyle} >
      <div >
        {blog.title} {blog.author} <button className='viewButton' onClick={toggleVisibility}>{detailsButton}</button>
        {visibleDetails && <Details blog={blog} handleBlogLike={updateBlog} handleBlogRemove={removeBlog}/>}
      </div>
    </div>
  )}

export default Blog