var state = {
        init: 0,
        ready: 1,
        playing: 2,
        paused: 3,
        stopped: 4
    },
    current_state = 0,
    context = new AudioContext(),
    source, node;

loadSample = function(mp3) {
    var request = new XMLHttpRequest();

    request.addEventListener('load', function() {
        context.decodeAudioData(request.response, function(decoded_data){
            source = context.createBufferSource();
            source.buffer = decoded_data;
            var st = new soundtouch.SoundTouch();
            st.tempo = 1.0;
            var filter = new soundtouch.SimpleFilter(new soundtouch.WebAudioBufferSource(source.buffer), st);
            console.log(filter);
            node = soundtouch.getWebAudioNode(context, filter);
            current_state = 1;
        }, function( e ){ console.log( e ); } //decoding errors
        );
    }, false);
    // Point the request to the sound-file that you want to play
    request.open( 'GET', mp3, true );
    // Set the XHR response-type to 'arraybuffer' to store binary data
    request.responseType = "arraybuffer";
    // Begin requesting the sound-file from the server
    request.send();
}

loadSample('./Lightning Bolt - 13 Monsters.mp3');

function play() {
    if(current_state !==  state.playing && current_state !== state.init){
        console.log("playing");
        current_state = 2;
        node.connect(context.destination);
    }
}
function pause() {
    if(current_state === state.playing){
        console.log("pausing");
        current_state = 3;
        node.disconnect();
    }
}
