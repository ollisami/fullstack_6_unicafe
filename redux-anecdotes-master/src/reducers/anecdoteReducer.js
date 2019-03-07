import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'CREATE',
    data: asObject(content)
  }
}

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.data)
    case 'VOTE':
      const id = action.data.id
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1 
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )
    case 'INIT_ANECDOTES':
      return action.data
    case 'RESET':
      return []
    default: return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export const createNew = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'CREATE',
      data: newAnecdote,
    })
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const temp = {
      content: anecdote.content,
      id: anecdote.id,
      votes: anecdote.votes + 1
    }
    const updatedAnecdote = await anecdoteService.update(temp.id, temp)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    })
  }
}

export default anecdoteReducer