import React, { useEffect, useState } from 'react'
import moment from "moment"
import { Alert } from "react-bootstrap"

// components
import Task from "@/components/tasks/Task"

// constants
import { ONE_DAY_SECONDS } from "@/utils/constants"


function ListTask({ tasks, sortByPrice, minDate, maxDate }) {

  const [filteredTask, setFilteredTask] = useState(tasks);

  const handleFilterByDate = () => {
    const endDate = maxDate + ONE_DAY_SECONDS;
    return tasks.filter((task) => {
      if ((!minDate || minDate <= moment(task.beginDate).unix()) && (!maxDate || endDate > moment(task.beginDate).unix())) {
        return true;
      }
      else {
        return false;
      }
    })
  }

  useEffect(() => {
    const data = handleFilterByDate().sort((a, b) => {
      if (sortByPrice === 'asc') return a.price - b.price;
      else return b.price - a.price;
    })

    setFilteredTask(data);
  }, [minDate, maxDate, sortByPrice])

  return (
    <div>
      { !filteredTask?.length && <Alert variant='danger'>There are no tasks to display!</Alert> }
      {
        filteredTask?.length > 0 && filteredTask.map((task) => {
          return <Task key={task._id} task={task} />
        })
      }
    </div>
  )
}

export default ListTask
