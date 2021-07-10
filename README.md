1. client.js edit document

```
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username");

var local_video = document.querySelector("#local-video");

// navigator.getUserMedia(constraint, success_cb,error_cb);

navigator.getUserMedia({
    video: true,
            audio: true
        }, function (myStream) {
            stream = myStream;
        local_video.srcObject = stream;
        // asks for permition to use camera
        // video icon on the right
}, function (error) {
    console.log(error) // DOMException: Permission denied
});
```

2. Basic structure of server

```
var webSocketServ = require('ws').Server;


var wss = new webSocketServ({
   port: 9090
})

var users = {};

wss.on('connection', function (conn) {
   console.log("User connected");

   conn.on('message', function (message) {
       var data;

       try {
           data = JSON.parse(message);
       } catch (e) {
           console.log("Invalid JSON");
           data = {};
       }
       switch (data.type) {

           case "login":
               if (users[data.name]) {
                   sendToOtherUser(conn, {
                       type: "login",
                       success: false
                   })
               } else {
                   users[data.name] = conn;
                   conn.name = data.name

                   sendToOtherUser(conn, {
                       type: "login",
                       success: true
                   })
               }
       }
   })

   conn.on('close', function (message) {
       console.log("Cpnnection closed");
   })

   conn.send("Hello, World!")

})
function sendToOtherUser(connection, message) {
   connection.send(JSON.stringify(message))
}
```

Client:

```
var connection = new WebSocket('ws://localhost:9090');

connection.onopen = function () {
   console.log("Connected to the server");
}

connection.onmessage = function (msg) {
   var data = JSON.parse(msg.data);
   switch (data.type) {
       case "login":
           loginProcess(data.success);
           break;
   }
}
connection.onerror = function (error) {
   console.log(error)
}

var local_video = document.querySelector("#local-video");
var name;
var connected_user;
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username");

// if statatement can be loaded only when application has already been loaded in browser
// so setTimeout needed
setTimeout(function () {
   if (connection.readyState === 1) {
       if (username != null) {
           name = username;
           if (name.length > 0) {
               send({
                   type: "login",
                   name: name
               })
           }
       }
   } else {
       console.log("Connection has not stublished");
   }
},3000)


function send(message) {
   if (connected_user) {
       message.name = connected_user;
   }
   connection.send(JSON.stringify(message))
}

// navigator.getUserMedia(constraint, success_cb,error_cb);

function loginProcess(success) {
   if (success === false) {
       alert("Try a different username");
   } else {
       navigator.getUserMedia({
           video: true,
           audio: true
       }, function (myStream) {
           stream = myStream;
           local_video.srcObject = stream;
           // asks for permition to use camera
           // video icon on the right
       }, function (error) {
           console.log(error) // DOMException: Permission denied
       });
   }
}
```
