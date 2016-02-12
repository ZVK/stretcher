/*
 * STRETCHER-JS GLOBAL VARIABLES
 */
var GLOBAL_ACTIONS = {
        'play': function() {
            if (current_state !== state.playing && current_state !== state.init) {
                current_state = state.playing;
                node.connect(context.destination);
                wavesurfer.play();
                console.log("playing");
            }
        },
        'pause': function() {
            if (current_state === state.playing) {
                current_state = state.paused;
                node.disconnect();
                wavesurfer.pause();
                console.log("pausing");
            }
        },
        'back': function() {
            if(current_state >= state.ready){
                wavesurfer.skipBackward();
            }
        },

        'forth': function() {
            if(current_state >= state.ready){
                wavesurfer.skipForward();
            }
        }
    },
    state = {
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
        up: {
            eighth: 1.125,
            quarter: 1.25,
            half: 1.50
        }
    },
    source, node, st,
    /*
     * WAVESURFER-JS
     */
    wavesurfer = WaveSurfer.create({
        audioContext: context,
        container: '#wave',
        waveColor: '#BDCCD4',
        progressColor: '#3FA9F5',
        audioRate: 1,
        normalize: true
    });
/*
 * EVENTS
 */
//waveform play function
wavesurfer.on('play', function(e) {
});
//wave ready state function
wavesurfer.on('ready', function() {
    var timeline = Object.create(WaveSurfer.Timeline);

    timeline.init({
        wavesurfer: wavesurfer,
        container: "#wave-timeline"
    });
});
//waveform error reporting
wavesurfer.on('error', function(err) {
    console.error(err);
});
//waveform initial loading function
wavesurfer.on('loading', function(percent, request) {
    console.log(percent);
    console.log(request);
    if (percent >= 100) {
        document.getElementById("loading").innerHTML = "initializing...";
        context.decodeAudioData(request.response, function(decoded_data) {
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
            }, function(e) {
                console.log(e);
            } //decoding errors
        );
    } else {
        document.getElementById("loading").innerHTML = percent + "% loaded";
    }
});
//waveform end of track funciton
wavesurfer.on('finish', function() {
    console.log('Finished playing');
});
//waveform time seek function
wavesurfer.on('seek', function(progress) {
    console.log('seeking to ' + Math.round(progress * 100) + "%");
});
/*
 * SOUNDTOUCH-JS DATA SETTERS
 */
function set_tempo(speed) {
    console.log("setting speed to " + speed);
    st.tempo = speed;
    wavesurfer.setPlaybackRate(speed);
    document.getElementById("tempo_value").innerHTML = (speed*100)+"%";
}

function set_pitch(semitones) {
    //calculate factor to multiply frequency by
    var frequency_factor = Math.pow(2, (semitones / 12));
    console.log("setting pitch to " + frequency_factor + "% (" + semitones + " semitones)");
    st.pitch = frequency_factor;
    document.getElementById("pitch_value").innerHTML = semitones+"st";
}

/*
 * AUDIO TRANSPORT BUTTONS
 */
function pressButton(e){
    var target = e && e.target || event.srcElement
    var action = target.getAttribute('data-action')
    if (action) {
        GLOBAL_ACTIONS[action]();
    }
}

/*
 * BOOTSTRAP-SLIDERS
 */
function createSliders() {
    //function to set a batch of attributes for an HTML element and object pair
    var set_attributes = function(element, attributes) {
        for (attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
        return element;
    };
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
    document.getElementById("tempo_wrapper").appendChild(tempo.element);
    document.getElementById("pitch_wrapper").appendChild(pitch.element);
}
// Drag'n'drop
document.addEventListener('DOMContentLoaded', function () {
    var toggleActive = function (e, toggle) {
        e.stopPropagation();
        e.preventDefault();
        toggle ? e.target.classList.add('wavesurfer-dragover') :
            e.target.classList.remove('wavesurfer-dragover');
    };

    var handlers = {
        // Drop event
        drop: function (e) {
            toggleActive(e, false);

            // Load the file into wavesurfer
            if (e.dataTransfer.files.length) {
                wavesurfer.loadBlob(e.dataTransfer.files[0]);
            } else {
                wavesurfer.fireEvent('error', 'Not a file');
            }
        },

        // Drag-over event
        dragover: function (e) {
            toggleActive(e, true);
        },

        // Drag-leave event
        dragleave: function (e) {
            toggleActive(e, false);
        }
    };

    var dropTarget = document.querySelector('#drop');
    Object.keys(handlers).forEach(function (event) {
        dropTarget.addEventListener(event, handlers[event]);
    });
});

function init() {
    wavesurfer.load('./BeachBlazer.wav');
    createSliders();
}