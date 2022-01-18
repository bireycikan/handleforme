import React, { useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"

// context
import { UserContext } from "@/context/UserContext"

function CreateTask() {
  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCreateTask = () => {
    if (isLoggedIn) {
      navigate('/create-task')
    }
    else {
      navigate('/login')
    }
  }

  return (
    <div className='d-flex flex-row justify-content-end mb-5'>
      <Button
        onClick={handleCreateTask}
      >Create Task
      </Button>
    </div>
  )
}

export default CreateTask
