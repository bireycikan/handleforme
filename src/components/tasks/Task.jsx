import React from 'react'
import { Card } from "react-bootstrap"
import moment from "moment"

function Task({ task }) {
  const { name, location, beginDate, price, description } = task;

  const formattedDate = moment(beginDate).utc().format("MM/DD/YYYY");

  return (
    <Card className='mb-3'>
      <Card.Body className='d-flex flex-column'>
        <Card.Subtitle className='d-flex flex-row mb-3'>
          <span className='me-auto'>{name} - {location} - {formattedDate}</span>
          <span>{price} ₺</span>
        </Card.Subtitle>
        <Card.Text>
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Task
