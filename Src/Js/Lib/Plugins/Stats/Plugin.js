define(["Core/Plugin", "Plugins/Stats/Stats"],

    function(Plugin, Stats) {

        function StatsPlugin() { 
            this.stats = null;
        }

        StatsPlugin.prototype = new Plugin();

        StatsPlugin.prototype.load = function(engine) {
            Plugin.prototype.load.call(this, engine);
            
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.bottom = '0px';
            this.stats.domElement.style.zIndex = 100;
            document.body.appendChild(this.stats.domElement);
        }

        StatsPlugin.prototype.update = function() {
            this.stats.update();
        }

        return (StatsPlugin);
    }
);