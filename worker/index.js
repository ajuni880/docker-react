const redis = require('redis')
const keys = require('./keys')

const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
  }
})

let sub;
(async () => {
  await redisClient.connect();
  sub = redisClient.duplicate()
  await sub.connect();

  await sub.subscribe('insert', (message, channel) => {
    console.log(message, fib(parseInt(message)));
    redisClient.hSet('values', message, fib(parseInt(message)))
  })
})()

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

