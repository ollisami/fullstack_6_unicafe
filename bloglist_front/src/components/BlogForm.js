import React from 'react'
import  { useField } from '../hooks'
import { connect } from 'react-redux'
import {createBlog} from '../reducers/blogReducer'
import { setNotification} from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const BlogForm = (props) => {

const newTitle  = useField('text')
const newAuthor = useField('text')
const newUrl    = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle.value,
      author: newAuthor.value,
      url: newUrl.value,
      likes: 0,
    }

    const newBlog = await blogService.create(blogObject)
    props.createBlog(newBlog)
    props.setNotification(`a new blog ${newTitle.value} by ${newAuthor.value} added`)
    newTitle.reset()
    newAuthor.reset()
    newUrl.reset()
  }

  return (
    <form onSubmit={addBlog}>
    <label>
        Title:
        <input {...newTitle.props()} />
    </label>
    <br></br>
    <label>
        Author:
        <input {...newAuthor.props()}/>
    </label>
    <br></br>
    <label>
    URL
    <input {...newUrl.props()} />
    </label>
    <button type="submit">Lisää</button>
    </form>
  )
}

const ConnectedBlogForm = connect(
    null, {createBlog, setNotification}
)(BlogForm)

export default ConnectedBlogForm