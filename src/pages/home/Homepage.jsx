import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Alert, Spinner, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "@/utils/axios"
import moment from "moment"

// hooks
import { useFetch } from "@/hooks/useFetch"

// context
import { UserContext } from "@/context/UserContext"

// components
import ListTask from "@/components/tasks/ListTask"
import CreateTask from "@/components/tasks/CreateTask"


function Homepage() {
  const navigate = useNavigate();
  const { logIn, setUserInfo } = useContext(UserContext);
  const { data, isPending, error } = useFetch('http://localhost:5000/api/task/list');
  const [sortPrice, setSortPrice] = useState('asc');
  const [minDate, setMinDate] = useState(0)
  const [maxDate, setMaxDate] = useState(0)
  const [filterDateError, setFilterDateError] = useState('')

  const handleMinDate = (e) => {
    const unix = moment(e.target.value).unix()
    setMinDate(unix)
  }

  const handleMaxDate = (e) => {
    const unix = moment(e.target.value).unix()
    setMaxDate(unix)
  }

  useEffect(() => {
    const checkLoggedIn = async () => {
      const response = await axios.get('/api/user/login');
      if (response.data.success) {
        logIn();
        setUserInfo(response.data.user)
      }
      else {
        navigate('/login', { replace: false })
      }
    }

    checkLoggedIn();
  }, [])

  useEffect(() => {
    setFilterDateError('')

    if (minDate && maxDate && minDate > maxDate) {
      setFilterDateError('Max date cannot be smaller then Min date!');
    }
    else {
      setFilterDateError('')
    }
  }, [minDate, maxDate])

  return (
    <div className='mt-5'>
      <CreateTask />
      <div className='d-flex flex-row align-items-center'>
        <div className='d-flex flex-column mb-3 me-5'>
          <p>Filter Between Date</p>
          <div className='d-flex flex-row'>
            <input 
              onChange={handleMinDate}
              type="date" 
            />
            <span className='ms-1 me-1'>-</span>
            <input 
              onChange={handleMaxDate}
              type="date" 
            />
          </div>
          {
            filterDateError && <Alert variant='danger' >{filterDateError}</Alert>
          }
        </div>
        <div className='d-flex flex-column mb-3'>
          <p>Sort by price</p>
          <div>
            <Button 
              onClick={() => setSortPrice('asc')}
              className='me-3'
            >Asc
            </Button>
            <Button
              onClick={() => setSortPrice('desc')}
            >Desc
            </Button>
          </div>
        </div>
      </div>
      { error && <Alert variant='danger'>{error}</Alert> }
      { isPending && 
        (
          <Fragment>
            <Spinner animation="border" role="status" />
            Loading...
          </Fragment> 
        )
      }
      { data && <ListTask tasks={data.tasks} sortByPrice={sortPrice} minDate={minDate} maxDate={maxDate} /> }
    </div>
  )
}

export default Homepage
