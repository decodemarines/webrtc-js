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