var SoundsManager = (function() {
    var sounds = {};
    var isMuted = false;

    function registerSound(soundKey, src, isLoop) {
        sounds[soundKey] = new Audio(src);
        if (isLoop) sounds[soundKey].loop = true;
    }
    function setVolume(volume) {
        Object.keys(sounds).forEach(function (key) {
            sounds[key].volume = volume;
        });
    }
    function mute() {
        setVolume(0);
        isMuted = true;
    }
    function unMute() {
        setVolume(1);
        isMuted = false;
    }
    function play(soundKey, currentTime) {
        var sound = sounds[soundKey];
        if (sound) {
            if (currentTime) sound.currentTime = currentTime;
            sound.play();
        } else {
            throw 'Sound not registered';
        }
    }
    function pause(soundKey) {
        var sound = sounds[soundKey];
        if (sound) {
            sound.pause();
        } else {
            throw 'Sound not registered';
        }
    }
    function playSoundFromSource(src) {
        if (!isMuted) new Audio(src).play();
    }
    function toggleMute() {
        isMuted ? unMute() : mute();
    }
    return {
        registerSound: registerSound,
        play: play,
        pause: pause,
        mute: mute,
        unMute: unMute,
        playSoundFromSource: playSoundFromSource,
        toggleMute: toggleMute
    }
})();