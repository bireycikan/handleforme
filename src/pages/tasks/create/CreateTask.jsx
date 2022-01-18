import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "@/utils/axios"

// context
import { UserContext } from "@/context/UserContext"

function CreateTask() {
  const navigate = useNavigate()
  const { isLoggedIn, setUserInfo, logIn } = useContext(UserContext)
  const [job, setJob] = useState({
    name: "",
    description: "",
    price: 0,
    beginDate: "",
    location: ""
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setUserInfo(null)
      navigate('/login', { replace: false })
      return;
    }

    if (!job.name || !job.description || !job.price || !job.beginDate || !job.location) {
      setError('Fields cannot be empty!');
      return;      
    }

    axios.post('/api/task/create', job)
      .then((response) => {
        navigate('/')
      })
      .catch((err) => {
        console.log('error', err)
      })
  }

  useEffect(() => {
    const checkLoggedIn = async () => {
      const response = await axios.get('/api/user/login');
      if (!response.data.success) {
        navigate('/login', { replace: false })
        return;
      }

      logIn();
      setUserInfo(response.data.user)
    }

    checkLoggedIn();
  }, [])

  return (
    <Fragment>
      { error && <Alert variant='danger'>{error}</Alert> }
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicJob">
          <Form.Label>Job name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Job name" 
            value={job.name} 
            onChange={(e) => setJob({...job, name: e.target.value})} 
          />
        </Form.Group>
    
        <Form.Group className="mb-3" controlId="formBasicJobDescription">
          <Form.Label>Job description</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            value={job.description} 
            onChange={(e) => setJob({...job, description: e.target.value})} 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicJobPrice">
          <Form.Label>Job price</Form.Label>
          <Form.Control 
            type="number" 
            min={0}
            placeholder="Job price" 
            value={job.price} 
            onChange={(e) => setJob({...job, price: e.target.value})} 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicJobDate">
          <Form.Label>Job begin date</Form.Label>
          <Form.Control 
            type="date" 
            placeholder="Job begin date" 
            value={job.beginDate} 
            onChange={(e) => setJob({...job, beginDate: e.target.value})} 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicJobLocation">
          <Form.Label>Job location</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Job location" 
            value={job.location} 
            onChange={(e) => setJob({...job, location: e.target.value})} 
          />
        </Form.Group>
    
        <Button variant="primary" type="submit">
          Create job
        </Button>
      </Form>
    </Fragment>
  )
}

export default CreateTask
