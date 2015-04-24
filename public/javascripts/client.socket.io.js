/**
 *
 * Parth Satra
 */

// On loading the document hides the chat div so that user can first register with the server
$(document).ready(function() {
    // Shows
    $("#nickname_div").show();
    $("#error").hide();
    $("#window").hide();
    $("#chat_div").hide();
});

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

// Creates connection to server with port 3000
var server_name = 'http://127.0.0.1:3000/';
var server = io.connect(server_name);
console.log('Client: Connecting to server '+ server_name);

$("#register").click( function() {
    // Send nick name to server
    var nickname = $("#nickname").val();
    if(myTrim(nickname).length != 0) {
        server.emit('register', {user: nickname});
    } else {
        $("#error").text("Please enter valid nickname")
        $("#error").show();
    }
    $("#nickname").val("");
});

server.on('response', function(data) {
    if(data.status == true) {
        // Registration successful
        $("#nickname_div").hide();
        $("#error").hide();
        $("#window").show();
        $("#chat_div").show();
        $("#headerid").text(data.text);
    } else {
        $("#error").text("Nickname already exists. Please try a new one")
        $("#error").show();
        $("#nickname").val("");
    }
});

$("#send").click( function() {
    var message = $("#chat").val();
    if(myTrim(message).length != 0)  {
        server.emit('chat', {message: message})
    }
    $("#chat").val("");
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