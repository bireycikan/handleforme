require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const corsOptions = require('./utils/corsOptions');
const connect = require('./db/connect');
const redis = require('redis');
const session = require('express-session');
const bodyParser = require('body-parser')
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
})

redisClient.on('error', (err) => {
  if (err.code === "ECONNREFUSED") {
    console.log('Redis connection dropped. Check your redis service and credentials.');
  }
})

redisClient.on('connect', () => {
  console.log('Redis connection established successfully.');
})

const user = require('./routes/user');
const task = require('./routes/task');


// connect to mongodb
const connection_string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bireymongo.z7pmj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const connection = connect(connection_string, mongoose);

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session(
  {
    store: new RedisStore({ client: redisClient }),
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1 // 1 hour
      // maxAge: 10000 // 10sn
    }
  })
)


// custom middleware
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('Redis connection lost!'));
  }
  req.connection = connection;
  next();
})

// routes
app.use('/api/user', user);
app.use('/api/task', task);

// global error handling
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(400).send({ code: err.code })
  }
  else if (err) {
    if (err.message === "FILE_MISSING") {
      res.status(400).send({ code: "FILE_MISSING" })
    }
    else {
      res.status(500).send({ code: "SERVER_ERROR", message: err.message || 'Something failed!' })
    }
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})