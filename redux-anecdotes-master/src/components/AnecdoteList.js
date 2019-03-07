import React from 'react';
import { connect } from 'react-redux'
import {voteAnecdote} from '../reducers/anecdoteReducer'
import {clearNotification, notificationChange} from '../reducers/notificationReducer'

const AnecdoteList= (props) => {
    const { visibleAnecdotes } = props
    const vote = (anecdote) => {
      props.voteAnecdote(anecdote.id)
      props.notificationChange(`You voted '${anecdote.content}'`)
      

      setTimeout(() => {
        props.clearNotification()
      }, 5000)
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

  const mapDispatchToProps = dispatch => {
    return {
        clearNotification: () => {
            setTimeout(() => {
                dispatch(clearNotification())
            }, 5000)
        },
        voteAnecdote: value => {
            dispatch(voteAnecdote(value))
        },
        notificationChange: value => {
            dispatch(notificationChange(value))
        },
    }
}

const ConnectedAnecdoteList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList