/**
 *
 * Parth Satra
 */

 // Creates connection to server with port 3000

$(document).ready(function() {
    $("#nickname_div").show();
    $("#window").hide();
    $("#chat_div").hide();
});

var server_name = 'http://127.0.0.1:3000/';
var server = io.connect(server_name);
console.log('Client: Connecting to server '+ server_name);

$("#register").click( function() {
    // Send nick name to server
    var nickname = $("#nickname").val();
    server.emit('register', {user: nickname});
});

server.on('response', function(data) {
    if(data.status == true) {
        // Registration successful
        $("#nickname_div").hide();
        $("#window").show();
        $("#chat_div").show();
    } else {
        // Registration failed
    }
});

$("#send").click( function() {
    var message = $("#chat").val();
    $("#chat").val("");
    server.emit('chat', {message: message})
});

server.on('message', function(data) {
    if($("#chatbody div").size() > 10) {
        $("#chatbody div:first").remove();
    }

    $("#chatbody").append("<div class='chat-message' style='max-width:100%;' class='col-xs-12'>" + data.message + "</div>")
});

$("#chat").keypress(function(e) {
   if(e.which === 13) {
       $('#send').click();
   }
});

$("#nickname").keypress(function(e) {
   if(e.which === 13) {
       $('#register').click();
   }
});