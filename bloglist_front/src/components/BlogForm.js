import React from 'react'
import  { useField } from '../hooks'
import { connect } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { Form, Button } from 'react-bootstrap'

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
    <Form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>Title:</Form.Label>
        <Form.Control {...newTitle.props()} />
        <Form.Label>Author:</Form.Label>
        <Form.Control {...newAuthor.props()}/>
        <Form.Label>URL:</Form.Label>
        <Form.Control {...newUrl.props()} />
        <br></br>
        <Button variant="primary" type="submit">Lisää</Button>
      </Form.Group>
    </Form>
  )
}

const ConnectedBlogForm = connect(
  null, { createBlog, setNotification }
)(BlogForm)

export default ConnectedBlogForm