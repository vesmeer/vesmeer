define(
    [
        "Core/Plugin", "Plugins/FullScreen/THREEx.FullScreen"
    ],

    function(Plugin, THREExFullScreen) {

        /**
         * Allows to switch between full screen and normal screen mode.
         */
        function FullScreenPlugin() { }

        FullScreenPlugin.prototype = new Plugin();

        FullScreenPlugin.prototype.load = function(engine) {
            Plugin.prototype.load.call(this, engine);
            THREExFullScreen.FullScreen.bindKey(
                { charCode : 'f'.charCodeAt(0) },
                this.engine.eventListenerRegistrar
            );
        }

        FullScreenPlugin.prototype.update = function() { }

        return (FullScreenPlugin);
    }
);