const express = require('express');
const router = express.Router();


// create task
router.post('/create', async (req, res) => {
  try {
    const { name, description, price, beginDate, location } = req.body;
    const Task = req.connection.model('Task');
    const task = new Task({
      name,
      description,
      price,
      beginDate,
      location
    })

    await task.save();
    res.send({ success: true })
  } catch (err) {
    throw new Error("Job could not be created!")
  }
})


// list task
router.get('/list', async (req, res) => {
  try {
    const Task = req.connection.model('Task');
    const allTasks = await Task.find({}).exec();
    res.send({ success: true, tasks: allTasks })
  } catch (error) {
    throw new Error("Job list could not be fetched!")
  }
})



module.exports = router;