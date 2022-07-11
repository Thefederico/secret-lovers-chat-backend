const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://secret-lovers.netlify.app'
  }
})

const PORT = 3001
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

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`)
})
