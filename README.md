# stretcher

A time stretching web app using soundtouch-js built for Berklee PULSE.

You can find more details on that library here: [soundtouch-js](https://github.com/ZVK/soundtouch-js)

## SoundTouch Basics:

The following code exposes soundtouch objects to the browser window:

<pre><code>
window.soundtouch = {
    'RateTransposer': RateTransposer,
    'Stretch': Stretch,
    'SimpleFilter': SimpleFilter,
    'SoundTouch': SoundTouch,
    'WebAudioBufferSource': WebAudioBufferSource,
    'getWebAudioNode': getWebAudioNode
};
</code></pre>

Here are the required argument types each constructor takes:

- RateTransposer createBuffer=bool
- Stretch createBuffers=bool, sampleRate=int
- SimpleFilter sourceSound=obj, pipe=obj
- SoundTouch sampleRate=int
- WebAudioBufferSource buffer=obj 
- getWebAudioNode context=obj, filter=obj 