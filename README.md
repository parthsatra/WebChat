# WebChat
Sample web chat application in node.js, twitter bootstrap and express.js

# Description

The appplication creates a server in node.js using express.js framework for a multiuser chat application where users can log on and chat with other users. The user has to register with the server with his nickname so that other users can identify the person chatting and then can chat freely with other users.

"app.js" file contains the server code. Client code is build using jade, hence index.html is generated from index.jade file present under views. Client side javascript code for socket connections and other events is present in "client.socket.io.js". The code also uses JQuery and bootstrap public libraries. 

# Steps to run the application. 

1) Install node js on the machine.

2) Clone this git repository which contains the application code. 

3) install the required packages using the following command. These package to be installed include "express", "morgan", "cookie-parser", "body-parser", "socket.io" and "jade" 

    -> npm install <package_name> --save
    
4) Now you are ready to run the application. To run the application run the following command
    
    -> node app.js
    
5) The server starts running on port 3000. Now open the browser and connect to "http://localhost:3000". This will open the web client. You can open multiple clients and now you are ready to chat. 
