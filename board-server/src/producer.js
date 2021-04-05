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

const producer = kafka.producer()
const produce = async ({ from, message }) => {
  await producer.connect()
  await producer.send({
    topic: 'test-topic-1',
    messages: [
      { key: null, value: message, partition: 0 }
    ]
  })
}
module.exports = produce
