const { Kafka, logLevel } = require("kafkajs")

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  clientId: "my-app",
  brokers: ["pkc-l6ojq.asia-northeast1.gcp.confluent.cloud:9092"],
  ssl: {
    rejectUnauthorized: true
  },
  sasl: {
    mechanism: 'plain',
    username: 'B2IYNPMFOQQDVJJB',
    password: '1Odnre0txJek3jU0VlZFbIriNKwkW3mZRc2YA02xPScKMKVrelcoTPM2m7URiezt'
  }
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const consume = async cb => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic-1' })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
      // const messageObject = JSON.parse(message.value.toString())
      cb(message.value.toString())
    },
  })
}
module.exports = consume
