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

// Simple trim function that removes empty spaces from the string.
// This is used mainly for error handling and only sending a proper chat message.
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

// Creates connection to server with port 3000
var server_name = 'http://127.0.0.1:3000/';
var server = io.connect(server_name);
console.log('Client: Connecting to server '+ server_name);

// On click function on registering. This function is called when user clicks on the register button.
$("#register").click( function() {
    // Extract the nickname from the text field.
    var nickname = $("#nickname").val();
    if(myTrim(nickname).length != 0) {
        // If the nickname is valid then sends the nickname to the server.
        server.emit('register', {user: nickname});
    } else {
        // If the nickname is incorrect then just displays the error message.
        $("#error").text("Please enter valid nickname")
        $("#error").show();
    }
    $("#nickname").val("");
});

// Call back function form server on registration.
server.on('response', function(data) {
    if(data.status == true) {
        // Registration successful.
        // Thus hiding the registration div and showing the chat div.
        $("#nickname_div").hide();
        $("#error").hide();
        $("#window").show();
        $("#chat_div").show();
        $("#headerid").text(data.text);
    } else {
        // Displays the appropriate error message from the server in case of a failure.
        $("#error").text("Nickname already exists. Please try a new one")
        $("#error").show();
        $("#nickname").val("");
    }
});

// On click function, which gets called on clicking on the send button.
$("#send").click( function() {
    // Extracts the chat message
    var message = $("#chat").val();
    if(myTrim(message).length != 0)  {
        // If the message is not empty then send the message to the server.
        server.emit('chat', {message: message})
    }
    $("#chat").val("");
});

// Call back function from server to receive chats from other clients.
server.on('message', function(data) {
    // Kepping the size of the chat displayed to be limited.
    if($("#chatbody div").size() > 10) {
        $("#chatbody div:first").remove();
    }
    // Adding the new chat message.
    $("#chatbody").append("<div class='chat-message' style='max-width:100%;' class='col-xs-12'>" + data.message + "</div>")
});

// Functions called on pressing enter on the text fields.
// This is mainly done to register enter key as a special event which is to register it same as the button click.
// Thus user when presses enter after typing the message the send button will be clicked automatically.
$("#chat").keypress(function(e) {
   if(e.which === 13) {
       $('#send').click();
   }
});

// Similar enter key event for the nickname field.
$("#nickname").keypress(function(e) {
   if(e.which === 13) {
       $('#register').click();
   }
});