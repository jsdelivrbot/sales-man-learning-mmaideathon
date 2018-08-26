const express = require('express')
const http = require('http')
const server = http.createServer(express())
const socketIo = require('socket.io')
const io = socketIo(server)
const sockets = []
io.on('connection', (socket) => {
    sockets.push(socket)
    socket.on('get-feedback', (data) => {
        sockets.filter(soc => soc != socket).forEach((soc) => {
            soc.emit('send-feedback', data)
        })
    })
})
server.listen(5000, () => {
    console.log("listening on 5000")
})
