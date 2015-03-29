define(["moment"],

    function(moment) {

        /**
         * Provides time and timing related routines.
         */
        function Time() { }

        /* Time between two frames in seconds. It's used as frame-to-seconds 
           conversion factor, therefore setting it to 1.0 will introduce no 
           change when applied. */
        Time.frameTime = 1.0;

        /* Time elapsed since the rendering of the scene began. */
        Time.elapsedTime = 0;

        /**
         * Returns the operating system date and time. An optional argument 
         * format is accepted.
         */
        Time.getSystemDateTime = function(format) {
            if (typeof(format) === 'undefined') {
                format = 'MMM Do YYYY, h:mm:ss a';
            }
            return moment().format(format);
        }

        /**
         * Returns the date and time within the application. An optional 
         * argument format is accepted.
         */
        Time.getUniverseDateTime = function(format) {
            if (typeof(format) === 'undefined') {
                format = 'MMM Do YYYY, h:mm:ss a';
            }
            return moment().format(format);
        }

        return (Time);

    }
);
