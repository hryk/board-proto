require("dotenv").config()
const consume = require("./consumer.js")
const produce = require("./producer.js")
const WebSocket = require("ws")
const { v4: uuidv4 } = require("uuid")
const wss = new WebSocket.Server({ port : 8080 , clientTracking: true})
const socketMap = {}
const socketRevMap = {}

consume((message) => {
  wss.clients.forEach(function each(client){
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
})

wss.on("connection", function connection (ws) {
  const id = uuidv4()
  socketMap[id] = ws
  socketRevMap[ws] = id
  console.log("client connected: " + id)

  ws.on("message", function incoming(message) {
    const from = socketRevMap[ws]
    console.log("message from id: " + from)
    console.log(message)
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (ws !== client) {
          client.send(message)
        }
      }
    })
    // produce({ from: 'dummy', message })
  })
})
