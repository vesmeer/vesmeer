define(["THREE"],

    function(THREE) {

        /**
         * Base scene object.
         */
        function Scene() {
            THREE.Scene.call(this);

            /* Currently selected scene object. */
            this._selectedSceneObject = null;

            /* True once all the assets are loaded from the server. */
            this._loaded = false;
        }

        Scene.prototype = Object.create(THREE.Scene.prototype);

        /**
         * Returns the currently selected scene object.
         */
        Scene.prototype.getSelectedObject = function() {
            return this._selectedSceneObject;
        }

        Scene.prototype.setSelectedObject = function(sceneObject) {
            this._selectedSceneObject = sceneObject;
        }

        /**
         * Returns the scene object with the given name.
         */
        Scene.prototype.findObjectByName = function(name) {
            return THREE.Scene.prototype.getObjectByName.call(
                this, name, true);
        }

        Scene.prototype.setLoaded = function(status) {
            this._loaded = status;
        }

        Scene.prototype.isLoaded = function() {
            return this._loaded;
        }

        return (Scene);

    }
);
