// Codec detection is a browser capability, outside the audio service.
function getPreferredPianoSampleExtension() {
    try {
        const probe = document.createElement('audio');
        const oggSupport: string = typeof probe.canPlayType === 'function'
            ? probe.canPlayType('audio/ogg; codecs="vorbis"')
            : '';
        return oggSupport && oggSupport !== 'no' ? 'ogg' : 'mp3';
    }
    catch (_) {
        return 'mp3';
    }
}
