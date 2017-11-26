const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users()

// things to remember

    // io emits an event to everyone i.e. admin to all users
    // socket emits to that socket only i.e. user to users
    // broadcast emits to all but the user itself
    // use io.to or socket .to basically ".to" to emit events in a single room

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('some where')   
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
          return callback('Name and room name are required. And should only be string');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        // socket.leave(params.name);

        socket.emit('newMessage' ,generateMessage('Admin','chat app'))
        
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} is here`));

        callback();
      });

    socket.on('createMessage', (messageData, callback)=>{
        var user = users.getUser(socket.id);

        if(user && isRealString(messageData.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name, messageData.text))   
        }
        callback()
    })

    socket.on('locationGiven',(coords)=>{
        var user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude))
        }
    })

    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id)

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left`))
        }
    })
});

server.listen(port,()=>{
    console.log('server is running on port ' + port)
})

