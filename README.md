# Stretcher

A time stretching web app using soundtouch-js.

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

## Browser Requirements
MP3 Support:
Chome >= 3.0
Safari >= 3.1
Safari Mobile >= 3.2
Opera >= 10.50
Firefox >= 3.5
[Mozilla's Browser Compatibility Table](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility)
<pre>
To avoid patent issues, support for MP3 is not built directly into Firefox. Instead it relies on support from the OS. Firefox supports this format on the following platforms: Windows Vista+ since Firefox 22.0, Android since Firefox 20.0, Firefox OS since Firefox 15.0, Linux since Firefox 26.0 (relies on GStreamer codecs) and OS X 10.7 since Firefox 35.0.
</pre>
