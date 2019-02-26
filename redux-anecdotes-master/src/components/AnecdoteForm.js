import React from 'react';
import {createAnecdote} from '../reducers/anecdoteReducer'

const AnecdoteForm = ({store}) => {

    const create = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        store.dispatch(
            createAnecdote(content)
        )
        event.target.anecdote.value = ''
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

export default AnecdoteForm