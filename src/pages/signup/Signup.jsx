import React, { Fragment, useState, useRef, useContext } from 'react'
import { Form, Button, ProgressBar, Alert, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "@/utils/axios"

// context
import { UserContext } from "@/context/UserContext"

function Signup() {
  const navigate = useNavigate();
  const { logIn } = useContext(UserContext);
  const [invalidPassMessage, setInvalidPassMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(null)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')
  const [fileSelectError, setFileSelectError] = useState('')
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: ""
  })
  const form = useRef();

  const validatePassword = (e) => {
    const trimmed = e.target.value.trim();
    const lengthCondition = !(trimmed.length < 8);
    const upperCaseCondition = new RegExp(/(.*[A-Z])/, "g");
    const lowerCaseCondition = new RegExp(/(.*[a-z])/, "g");
    const numberCondition = new RegExp(/(.*\d)/, "g");

    if (!lengthCondition) {
      setInvalidPassMessage("8 characters!")
    }
    else if (!upperCaseCondition.test(trimmed)) {
      setInvalidPassMessage("1 upper case!")
    }
    else if (!lowerCaseCondition.test(trimmed)) {
      setInvalidPassMessage("1 lower case!")
    }
    else if (!numberCondition.test(trimmed)) {
      setInvalidPassMessage("1 number!");
    }
    else {
      setInvalidPassMessage('')
      setUser({ ...user, password: trimmed })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('')

    if (!user.fullname || !user.email || !user.phone || !user.password) {
      setError('Fields cannot be empty!');
      return;
    }
    if (!selectedFiles) {
      setFileSelectError('Please select a photo file!')
      return;
    }
    
    let formData = new FormData(form.current)

    axios.post("/api/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
      },
    })
    .then((response) => {
      if (!response.data.success) {
        setError(response.data.message);
        return;
      }

      setProgress(null);
      logIn();
      navigate('/')
    })
    .catch((err) => {
      const { code } = err && err.response && err.response.data;

      if (code === "FILE_MISSING") {
        setError('Please select a profile photo...');
      }
      else {
        setError('Something went wrong. Please try again later!');
      }
    })
  }

  const handleFileSelect = (e) => {
    setSelectedFiles(e.target.files)
    setFileSelectError('')
  }

  return (
    <Fragment>
      { 
        error && <Alert variant='danger' >{error}</Alert>
      }
      <Form ref={form} onSubmit={handleSubmit} encType='multipart/form-data'>
        <Form.Group className="mb-3" controlId="formBasicFullname">
          <Form.Label>Fullname</Form.Label>
          <Form.Control 
            onChange={(e) => setUser({...user, fullname: e.target.value})}
            value={user.fullname}
            type="text"
            name="fullname"
            placeholder="Enter your fullname"
          />
        </Form.Group>
    
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control 
            onChange={(e) => setUser({...user, email: e.target.value})}
            value={user.email}
            type="text"
            name="email"
            placeholder="Enter your email address"
          />
        </Form.Group>
    
        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control 
            onChange={(e) => setUser({...user, phone: e.target.value})}
            value={user.phone}
            type="text"
            name="phone"
            placeholder="Enter your phone"
          />
        </Form.Group>
    
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            onChange={validatePassword}
            type="password"
            name="password"
            placeholder="Enter your password"
          />
          {
            invalidPassMessage &&
            (
              <Form.Text className="text-muted">
                Password must have min {invalidPassMessage}
                <br />
              </Form.Text>
            )
          }
          
        </Form.Group>

        <Form.Group className="mb-3" controlId="formFile" >
          <Form.Label>Upload profile photo</Form.Label>
          <Form.Control 
            onChange={handleFileSelect}
            type="file"
            name="avatar"
          />
          { 
            fileSelectError && 
              <Alert variant='danger' >{fileSelectError}</Alert>
          }
          {
            !error && progress &&
              <ProgressBar animated striped variant="success" now={progress} label={`${progress}%`} max={100} min={0} />
          }
        </Form.Group>
        
        <Button
          variant="primary"
          type='submit'
          disabled={!error && progress}
        >
          { 
            (!error && progress)
              ? (
                <Fragment>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing up...
                </Fragment>
              )
              : 'Signup'
          }
        </Button>
      </Form>
    </Fragment>
  )
}

export default Signup
