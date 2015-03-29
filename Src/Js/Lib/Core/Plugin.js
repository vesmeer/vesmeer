define(
    [
        "Core/SceneObject", 
        "Plugins/VesmeerApp/BehaviorToSceneObjectsMap"
    ],

    function(SceneObject, behaviorToSceneObjectsMap) {

        /**
         * Plugin base class.
         */
        function Plugin() { 
            this.engine = null;
        }

        /**
         * Called upon loading the plugin. Engine provides access to the
         * program core objects for the plugin.
         */
        Plugin.prototype.load = function(engine) {
        	this.engine = engine;
        }

        /**
         * Assigns the behavior script to the scene objects defined in 
         * this plugin. The behavior-to-object mapping is defined in
         * EarthToSceneObjectsMap.js.
         */
        Plugin.prototype.assignBehaviorsToSceneObjects = function() {
            for(var sceneObjectName in behaviorToSceneObjectsMap) {
                for(var bIdx in behaviorToSceneObjectsMap[sceneObjectName]) {
                    this.engine.getScene().getObjectByName(sceneObjectName, true).addBehavior(
                        behaviorToSceneObjectsMap[sceneObjectName][bIdx]
                    );
                }
            }
        }

        return (Plugin);
	}
);
