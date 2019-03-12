import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  handleSubmit,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>käyttäjätunnus</Form.Label>
          <Form.Control {...username.props()} />
          <Form.Label>Salasana</Form.Label>
          <Form.Control {...password.props()}/>
          <br></br>
          <Button variant="primary" type="submit">kirjaudu</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default LoginForm