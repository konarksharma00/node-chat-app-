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

socket.on('newMessage', function(message){

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
  
    jQuery('#messages').append(html);
})

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    });
  
    jQuery('#messages').append(html);
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
