if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

let SONORE_MSG = null

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))

// POST version
// app.post('/', (req, res) => {
//   if (req.header('Authorization') !== process.env.SONORE_SECRET_KEY) {
//     res.status(401)
//     res.send('Unauthorized access')
//     return
//   }

//   SONORE_MSG = req.body.data
//   console.log('SONORE_MSG is now', SONORE_MSG)
//   io.emit('data', { data: SONORE_MSG })
// })

// debug only
app.get('/', (req, res) => {
  res.send('OK')
})

const port = process.env.SONORE_PORT || 3001
server.listen(port, () => {
  console.log(`listening on port ${port}`)
})

io.on('connection', socket => {

  console.log('connected client')

  socket.on('setdata', data => {
    if (socket.handshake.query && socket.handshake.query.producer === '1') {
      const secret = socket.handshake.headers.authorization
      if (secret === process.env.SONORE_SECRET_KEY) {
        SONORE_MSG = data
        io.emit('data', { data: SONORE_MSG })
      }
    } else {
      console.log('failed authentication to update sonore data')
    }
  })

})
