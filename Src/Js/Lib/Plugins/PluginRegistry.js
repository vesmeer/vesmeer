define(
    [
        "Plugins/Stats/Plugin", "Plugins/FullScreen/Plugin", 
        "Plugins/VesmeerApp/Plugin",
    ],

    function(StatsPlugin, VesmeerAppPlugin, FullScreenPlugin) {

        /**
         * Register new plugins by adding them to this object as
         * key/value pairs and adding them to the define() section above.
         */
        var pluginRegistry = {
            'Stats': new StatsPlugin(),
            'FullScreenPlugin': new FullScreenPlugin(),
            'VesmeerApp': new VesmeerAppPlugin(),
        }

        return (pluginRegistry);
    }
);