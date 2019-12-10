import * as express from 'express'
import * as socketio from 'socket.io'

const app = require('express')() as express.Application
app.set('port', process.env.PORT || 3000)

let http = require('http').Server(app)
let io = require('socket.io')(http, { path: '/napi' }) as socketio.Server

const people: socketio.Socket[] = []
let phoneRinging = false

io.on('connection', function(socket: socketio.Socket) {
    socket.on('startGame', () => {
        people.push(socket)
        console.log('playerTwo', people.length > 1)
        socket.emit('playerTwo', people.length > 1)
        socket.emit('phoneRinging', phoneRinging)

        socket.on('togglePhone', value => {
            console.log('phoneRinging', value)
            phoneRinging = value
            for (let person of people) {
                person.emit('phoneRinging', phoneRinging)
            }
        })
    })
})

const server = http.listen(3000, function() {
    console.log('listening on *:3000')
})
