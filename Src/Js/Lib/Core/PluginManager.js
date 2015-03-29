define(["Plugins/PluginRegistry"],

    function(pluginRegistry) {

        /**
         * Responsible for loading and executing plugins.
         */
        function PluginManager() { 
            this._plugins = [];
        }

        PluginManager.prototype.loadPlugins = function(engine) {
            for(var property in pluginRegistry) {
                if (pluginRegistry.hasOwnProperty(property)) {
                    this._plugins.push(this.loadPlugin(property, engine));
                }
            }
        }

        PluginManager.prototype.loadPlugin = function(name, engine) {
            pluginRegistry[name].load(engine);

            return pluginRegistry[name];
        }

        PluginManager.prototype.callPluginsUpdate = function() {
            for(var i = 0; i < this._plugins.length; i++) {
                this.callPluginUpdate(this._plugins[i]);
            }
        }

        PluginManager.prototype.callPluginUpdate = function(plugin) {
            plugin.update();
        }

        return (PluginManager);
    }
);