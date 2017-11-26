var socket = io();

socket.on('connect',function(){
    var createMailData= {
        from:'god',
        text:'you die'
    }
})

socket.on('disconnect',function(){
    console.log('disconnected')
})

socket.on('newMessage', function(newMessageData){
    console.log(newMessageData)
    var li = jQuery('<li></li>');

    li.text(`${newMessageData.from}: ${newMessageData.text}`)

    jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> location </a>');

    li.text(`${message.from}: `)
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li)
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault()

    var messageTextbox = jQuery('[name=message]');
    
      socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
      }, function () {
        messageTextbox.val('')
      });
})

var locbtn = jQuery('#send-location');

locbtn.on('click', function(){
    if(!navigator.geolocation){
        return alert('you are fucked');
    }

    locbtn.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        locbtn.removeAttr('disabled').text('Send location');
        console.log(position)
        socket.emit('locationGiven', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    },function(){
        locbtn.removeAttr('disabled').text('Send location');
        alert('you are so fucked.')
    })

})
