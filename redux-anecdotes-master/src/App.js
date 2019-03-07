import React from 'react';
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = (props) => {
  return (
    <div>
      <Notification/>
      <Filter/> 
      <AnecdoteForm/>
      <h2>Anecdotes</h2>
      <AnecdoteList/>
    </div>
  )
}

export default App
