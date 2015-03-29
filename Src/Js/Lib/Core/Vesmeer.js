define(["Core/Engine"], 

    function(Engine) {

        var Vesmeer = {};

        /**
         * Runs the application. 
         */
        Vesmeer.run = function() {
            var engine = new Engine()
            engine.init();
            engine.render();
        }

        return (Vesmeer);

    }
);