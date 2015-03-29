define(["Settings"],

    function(Settings) {

        function SoundUtils() {}

        SoundUtils.SOUNDS = {
            WindowOpen: "Assets/Sounds/window-open.mp3",
            WindowClose: "Assets/Sounds/window-close.mp3",
            LockIn: "Assets/Sounds/lock-in.mp3",
            Tick: "Assets/Sounds/tick.mp3"
        }

        /**
         * Plays the sound on the given file path.
         */
        SoundUtils.playSound = function(filePath) {
            if (!Settings.SOUNDS) return;

            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', filePath);
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
                audioElement.play();
            }, true);
        }

        return (SoundUtils);
    }
);
