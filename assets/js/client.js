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

