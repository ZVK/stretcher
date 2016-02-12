var state = {
        init: 0,
        ready: 1,
        playing: 2,
        paused: 3,
        stopped: 4
    },
    current_state = state.init,
    sample_rate = 44100,
    context = new AudioContext(),
    warp = {
        down: {
            eighth: 0.875,
            quarter: 0.75,
            half: 0.5
        },
        up: {eighth: 1.125,
            quarter: 1.25,
            half: 1.50
        }
    },
    source, node, st;

var wavesurfer = WaveSurfer.create({
    audioContext: context,
    container: '#wave',
    waveColor: 'blue',
    progressColor: 'orange',
    audioRate: 1,
    normalize: true
});
wavesurfer.on('play', function(e){
    console.log("playing")
});
wavesurfer.on('ready', function () {
    var timeline = Object.create(WaveSurfer.Timeline);

    timeline.init({
        wavesurfer: wavesurfer,
        container: "#wave-timeline"
    });
});

wavesurfer.on('loading', function(percent, request) {
    console.log(percent);
    console.log(request);
    if(percent >= 100){
        document.getElementById("loading").innerHTML = "initializing...";
        context.decodeAudioData(request.response, function(decoded_data){
            source = context.createBufferSource();
            source.buffer = decoded_data;
            st = new soundtouch.SoundTouch(sample_rate);
            st.tempo = 1.0;
            var filter = new soundtouch.SimpleFilter(new soundtouch.WebAudioBufferSource(source.buffer), st);
            console.log(filter);
            node = soundtouch.getWebAudioNode(context, filter);
            current_state = state.ready;
            wavesurfer.backend.setFilter(node);
            document.getElementById("loading").innerHTML = "";
            node.disconnect();
        }, function( e ){ console.log( e ); } //decoding errors
        );
    } else {
        document.getElementById("loading").innerHTML = percent+"% loaded";
    }
});

wavesurfer.on('finish', function () {
    console.log('Finished playing');
});

function set_tempo(speed){
    console.log("setting speed to "+speed);
    st.tempo = speed;
    wavesurfer.setPlaybackRate(speed);
}

function set_pitch(semitones){
    //calculate factor to multiply frequency by
    var frequency_factor = Math.pow(2, (semitones/12));
    console.log("setting pitch to "+frequency_factor+"% ("+semitones+" semitones)");
    st.pitch = frequency_factor;
}

//function to set a batch of attributes for an HTML element and object pair
function set_attributes(element, attributes) {
    for (attribute in attributes){
        element.setAttribute(attribute, attributes[attribute]);
    }
}

function init(){
    wavesurfer.load('./Lightning Bolt - 13 Monsters.mp3');
    //make the tempo slider we prepared above
    // Instantiate a tempo slider
    var tempo = {
        element: document.createElement("INPUT"),
        //store preset attributes
        styles: {
            // initial options object
            id: "tempo_slider",
            type: "range",
            min: 0.35,
            max: 2.0,
            step: 0.05,
            value: 1.0,
            onchange: "set_tempo(this.value);"
        }
    }, 
    pitch = {
        element: document.createElement("INPUT"),
        //store preset attributes
        styles: {
            // initial options object
            id: "pitch_slider",
            type: "range",
            min: -24,
            max: 24,
            step: 1,
            value: 1,
            onchange: "set_pitch(this.value);"
        }
    };
    //build sliders
    set_attributes(tempo.element, tempo.styles);
    set_attributes(pitch.element, pitch.styles)
    //add it to in at the bottom of our html body
    document.getElementById("tempo").appendChild(tempo.element);
    document.getElementById("pitch").appendChild(pitch.element);

}

function play() {
    if(current_state !==  state.playing && current_state !== state.init){
        console.log("playing");
        current_state = state.playing;
        node.connect(context.destination);
        wavesurfer.play();
    }
}
function pause() {
    if(current_state === state.playing){
        console.log("pausing");
        current_state = state.paused;
        node.disconnect();
        wavesurfer.pause();
    }
}


