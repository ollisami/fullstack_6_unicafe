import React from 'react'
import { connect } from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = (props) => {

    const create = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        const newanecdote = await anecdoteService.createNew(content)
        props.createAnecdote(newanecdote.content)
        props.setNotification(`New anecdote created: '${content}'`, 3)
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={create}>
                <div><input name='anecdote'/></div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

const ConnectedAnecdoteForm = connect(
    null, {createAnecdote, setNotification}
)(AnecdoteForm)

export default ConnectedAnecdoteForm