const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('some where')

    socket.emit('newMessage' ,generateMessage('Admin','chat app'))

    socket.broadcast.emit('newMessage',generateMessage('Admin','new user'));

    socket.on('createMessage', (messageData, callback)=>{
        io.emit('newMessage',generateMessage(messageData.from, messageData.text))
        callback('from server')
    })

    socket.on(locationGiven,(coords)=>{
        io.emit(newLocationMessage,generateLocationMessage('Admin',coords.latitude, coords.longitude))
    })

    socket.on('disconnect',()=>{
        console.log(' server disconnected')
    })
});

server.listen(port,()=>{
    console.log('server is running on port ' + port)
})

