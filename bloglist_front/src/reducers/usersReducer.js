import userService from '../services/users'

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: users,
    })
  }
}

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.data
  case 'RESET':
    return []
  default: return state
  }
}

export default blogReducer