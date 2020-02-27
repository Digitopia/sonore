require('dotenv').config()

const axios = require('axios')
const io = require('socket.io-client')

function generateFakeData() {
  return [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
  ]
}

// TODO: use namespaces instead
const url = `${process.env.SONORE_SERVER_URL}?producer=1`

let socket = io(url, {
  transportOptions: {
    polling: {
      extraHeaders: {
        'Authorization': process.env.SONORE_SECRET_KEY
      }
    }
  }
})

setInterval(() => {

  const data = generateFakeData()
  console.log(`sending ${data}`)

  // POST version
  // axios
  //   .post(
  //     process.env.SONORE_SERVER_URL,
  //     { data },
  //     { headers: { Authorization: process.env.SONORE_SECRET_KEY } }
  //   )
  //   .catch(err => {
  //     console.log('error sending data to server', err)
  //   })
  //   .then(res => {
  //     console.log('got response', res)
  //   })

  // Websocket version
  socket.emit('setdata', data)

}, 50)
