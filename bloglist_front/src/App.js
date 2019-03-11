import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import  { useField } from './hooks'
import {
  BrowserRouter as Router,
  Route, Link
} from 'react-router-dom'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Users from './components/Users'

import loginService from './services/login'
import blogService from './services/blogs'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, likeBlog } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import {userChange} from './reducers/userReducer'

const App = (props) => {
  const username  = useField('text')
  const password  = useField('password')
  const { user, users, blogs } = props

  useEffect(() => {
    props.initializeBlogs()
  },[])

  useEffect(() => {
    props.initializeUsers()
  },[])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.userChange(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username:username.value, password:password.value
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      props.userChange(user)
      username.reset()
      password.reset()

    } catch (exception) {
      props.setNotification('käyttäjätunnus tai salasana virheellinen')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    props.userChange('')
    username.reset()
    password.reset()
    props.setNotification('Uloskirjautuminen onnistui')
  }

  const updateBlog = async (event, blogObject) => {
    event.preventDefault()
    blogObject.likes++
    await blogService.update(blogObject)
    props.likeBlog(blogObject)
    props.setNotification('blog updated')
  }

  const removeBlog = (event, blogObject) => {
    event.preventDefault()
    blogService
      .remove(blogObject).then(() => {
        props.initializeBlogs()
        props.setNotification('blog deleted')
      })
  }

  const loginInformation = () => {
    return (!user ? null :
      <p>
        {user.name} logged in
        <button onClick={() => handleLogout()}>logout</button>
      </p>
    )
  }

  const RenderBlogList = () => (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key      = {blog.id}
            blog     = {blog}
            update   = {updateBlog}
            remove   = {removeBlog}
            username = {user.username}
          />
        )}
    </div>
  )

  const BasicApp = () => (
    <div>
        <h2>blogs</h2>
        {!user ? Login() : RenderBlogs()}
    </div>
  )

  const RenderBlogs = () => {
    return (
      <div>
        <Togglable buttonLabel='Create new'>
          <BlogForm />
        </Togglable>
        {RenderBlogList()}
    </div>
    )
  }

  const Login = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const Menu = () => {
    const padding = {
      paddingRight: 5
    }
    return (
      <div>
        <Link style={padding} to="/">Blogs</Link>
        <Link style={padding} to="/users">Users</Link>
        {loginInformation()}
      </div>
    )
  }

  const User = ({ user }) => {
    if ( user === undefined) { 
      return null
    }
  
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs:</h3>
        <ul>
          {user.blogs.map(blog => 
            <li key={blog.id} >
              <p>{blog.title}</p>
            </li>
          )}
        </ul>
      </div>
    )
  }
  
  const SingleBlog = ({ blog }) => {
    if ( blog === undefined) { 
      return null
    }
  
    return (
      <div>
        <h2>{blog.title}</h2>
        <p>{blog.url}</p>
        <p>
          {blog.likes} likes 
          <button onClick={(e) => updateBlog(e,blog)}>like</button>
        </p>
        <p>added by: {blog.author}</p>
      </div>
    )
  }

  const userById = (id) =>
    users.find(a => a.id === id)

  const blogById = (id) =>
    blogs.find(a => a.id === id)

  return (
    <div className="container">
      <Router>
        <div>
          <Notification/>
          <Menu />
          <Route exact path="/" render={() => <BasicApp/>} />
          <Route path="/users" render={() => <Users users={users} />} />
          <Route exact path="/users/:id" render={({ match }) =>
            <User user={userById(match.params.id)} />
          } />
          <Route exact path="/blogs/:id" render={({ match }) =>
            <SingleBlog blog={blogById(match.params.id)} />
          } />
        </div>
      </Router>
    </div>
  )
}



const mapStateToProps = (state) => {
  return {
    user: state.user,
    users: state.users,
    blogs: state.blogs,
  }
}

export default connect(
  mapStateToProps, {
    initializeBlogs,
    initializeUsers,
    setNotification,
    userChange,
    likeBlog
  })(App)