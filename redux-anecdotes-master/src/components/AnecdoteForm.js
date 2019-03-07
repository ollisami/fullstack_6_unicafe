import React from 'react'
import { connect } from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {clearNotification, notificationChange} from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

    const create = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        props.createAnecdote(content)
        props.notificationChange(`New anecdote created: '${content}'`)
        props.clearNotification()
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

const mapDispatchToProps = dispatch => {
    return {
        clearNotification: () => {
            setTimeout(() => {
                dispatch(clearNotification())
            }, 5000)
        },
        createAnecdote: value => {
            dispatch(createAnecdote(value))
        },
        notificationChange: value => {
            dispatch(notificationChange(value))
        },
    }
}

const ConnectedAnecdoteForm = connect(
    null, mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm