import app from './app'
import http from 'http'
import { Server } from 'socket.io'

const NEW_CHAT_MESSAGE = 'newMessage'
const PORT = process.env.PORT || 3001

const server = http.createServer(app)
const httpServer = server.listen(PORT)

const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*'
  }
})

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

console.log(`Server is running on port ${PORT}`)
