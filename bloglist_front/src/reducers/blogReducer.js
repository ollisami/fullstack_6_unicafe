import blogService from '../services/blogs'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: 0,
    id: getId()
  }
}

export const createBlog = (content) => {
    return {
        type: 'CREATE',
        data: asObject(content)
    }
}

export const likeBlog = (content) => {
    return {
        type: 'LIKE',
        data: content
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
      const blogs = await blogService.getAll()
      dispatch({
        type: 'INIT_BLOGS',
        data: blogs,
      })
    }
  }

const blogReducer = (state = [], action) => {
    switch (action.type) {
        case 'CREATE':
          return state.concat(action.data)
        case 'LIKE':
          const id = action.data.id
          const blogToChange = state.find(n => n.id === id)
          const changedBlog = { 
            ...blogToChange, 
            votes: blogToChange.likes + 1 
          }
          return state.map(blog =>
            blog.id !== id ? blog : changedBlog 
          )
        case 'INIT_BLOGS':
          return action.data
        case 'RESET':
          return []
        default: return state
    }
}

export default blogReducer