import React from 'react';
import { connect } from 'react-redux'
import {voteAnecdote} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'

const AnecdoteList= (props) => {
    const { visibleAnecdotes } = props

    const vote = (anecdote) => {
      props.voteAnecdote(anecdote)
      props.setNotification(`You voted '${anecdote.content}'`, 3)
    }

    return (
        visibleAnecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
            </div>
            </div>
        )
    )
}

const anecdotesToShow = ({filter, anecdotes}) => {
    return filter ? anecdotes.filter(anecdote => 
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
    ) : anecdotes
}

const mapStateToProps = (state) => {
    return {
      visibleAnecdotes: anecdotesToShow(state),
    }
  }

const ConnectedAnecdoteList = connect(
    mapStateToProps, {setNotification,voteAnecdote }
)(AnecdoteList)

export default ConnectedAnecdoteList