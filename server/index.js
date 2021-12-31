const redis = require('redis')
const express = require('express')
const cors = require('cors')
const keys = require('./keys')

const app = express()

app.use(cors())
app.use(express.json())

// postgres client setup
const { Pool } = require('pg')
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})

pgClient.on('error', () => console.log('Lost PG connection'))
pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err));
});

console.log(keys)
// Redis client setup
const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
  }
})
redisClient.on('error', (err) => console.log('Redis Client Error', err));
let redisPublisher;
(async () => {
  await redisClient.connect();
  redisPublisher = redisClient.duplicate()
  await redisPublisher.connect();
})()

// Express route handlers
app.get('/', (req, res) => {
  res.send('HI!')
})

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values')
  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values')
  res.send(values)
})

app.post('/values', async (req, res) => {
  const index = req.body.index

  if (index > 40) {
    return res.status(422).send('Index too high')
  }

  await redisClient.hSet('values', index, 'Nothing yet!')
  await redisPublisher.publish('insert', index)

  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
  res.send({ working: true })
})

app.listen(5000, err => {
  console.log('Listening')
})