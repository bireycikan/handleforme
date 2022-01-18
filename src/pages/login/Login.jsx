import React, { Fragment, useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Form, Button, Alert } from "react-bootstrap"
import axios from "@/utils/axios"

// context
import { UserContext } from "@/context/UserContext"

function Login() {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { logIn, setUserInfo } = useContext(UserContext)
  const navigate = useNavigate()

  const logInUser = async () => {
    try {
      const user = { username, password };
      const response = await axios.post('/api/user/login', user, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.data.success) {
        logIn();
        setUserInfo(response.data.user);
        navigate('/', { replace: false })
      }
      else {
        setError(response.data.message)
      }
    } catch (err) {
      setError('Something failed while logging in!');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Fields cannot be empty!')
      return;
    }

    logInUser();
  }

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant='danger' >{error}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicPhoneEmail">
          <Form.Label>Phone or E-mail</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter your phone or email address" 
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
    
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
    
        <Button
         variant="primary" 
         type="submit"
        >
          Login
        </Button>
      </Form>
    </Fragment>
  )
}

export default Login
