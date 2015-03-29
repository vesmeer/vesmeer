define(
    [], 

    function() {

        /**
         * The splash screen loading progress bar implementation.
         */
        function LoadSplashScreen() {

        }

        /**
         * Shows the loading splash screen.
         */
        LoadSplashScreen.show = function() {
            $("body").append([
                '<div id="splash-screen">',
                '  <div id="progress-bar-wrapper">', 
                '    <div id="progress-bar"></div>',
                '  </div>',
                '</div>'
            ].join('\n'));
            var top = window.innerHeight / 2 - 
                $("#splash-screen #progress-bar-wrapper").height() / 2;
            $("#splash-screen #progress-bar-wrapper").css('top', top + 'px');
        }

        /**
         * Updates the progress bar to reflect the loading progress.
         *
         * @param int progressPercent Percentage of progress.
         */
        LoadSplashScreen.update = function(progressPercent) {
            $("#splash-screen #progress-bar").css({
                'width': progressPercent + '%'
            });
        }

        /**
         * Hides the loading splash screen.
         */
        LoadSplashScreen.hide = function() {
            $("#splash-screen").fadeOut(2000, function() {
                this.remove()
            });
        }

        return (LoadSplashScreen)
    }
);
