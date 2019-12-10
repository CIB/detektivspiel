import * as express from 'express'
import * as socketio from 'socket.io'

const app = require('express')() as express.Application
app.set('port', process.env.PORT || 3000)

let http = require('http').Server(app)
let io = require('socket.io')(http, { path: '/napi' }) as socketio.Server

const people: socketio.Socket[] = []
const actionReplay = [['togglePhone', false]]

io.on('connection', function(socket: socketio.Socket) {
    socket.on('startGame', () => {
        people.push(socket)
        console.log('playerTwo', people.length % 2 === 1)
        socket.emit('playerTwo', people.length % 2 === 1)
        for (let action of actionReplay) {
            socket.emit('synchronizeState', action)
        }

        socket.on('synchronizeState', action => {
            console.log('action', action)
            actionReplay.push(action)
            for (let person of people) {
                person.emit('synchronizeState', action)
            }
        })
    })
})

const server = http.listen(3000, function() {
    console.log('listening on *:3000')
})
