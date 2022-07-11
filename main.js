const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = new Server(server)

const whiteList = ['*']
const options = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('No permitido'))
    }
  }
}
app.use(cors(options))

const NEW_CHAT_MESSAGE = 'newMessage'

io.on('connection', socket => {
  console.log(`Client ${socket.id} connected`)

  const { chadId } = socket.handshake.query
  socket.join(chadId)

  socket.on(NEW_CHAT_MESSAGE, data => {
    io.in(chadId).emit(NEW_CHAT_MESSAGE, data)
  })

  socket.on('disconnect', () => {
    socket.leave(chadId)
  })
})

app.listen(port, () =>
  console.log(`Api listening on http://localhost:${port}/`)
)
