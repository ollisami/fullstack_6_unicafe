import React from 'react'
import { connect } from 'react-redux'
import {filterChange} from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
  props.filterChange(event.target.value)   
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}
/*
const mapDispatchToProps = dispatch => {
    return {
        filterChange: value => {
        dispatch(filterChange(value))
        },
    }
}

const ConnectedFilter= connect(
    null,
    mapDispatchToProps
)(Filter)*/

const ConnectedFilter= connect(
    null,
    { filterChange }
)(Filter)

export default ConnectedFilter