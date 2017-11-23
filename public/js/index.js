var socket = io();

socket.on('connect',function(){
    var createMailData= {
        from:'god',
        text:'you die'
    }
    socket.emit('createMessage', createMailData)
})

socket.on('disconnect',function(){
    console.log('disconnected')
})

socket.on('newMessage', function(newMessageData){
    console.log(newMessageData)
})
