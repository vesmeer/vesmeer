define(["THREE"],

    function(THREE) {

        /**
         * Base scene object.
         */
        function Scene() {
            THREE.Scene.call(this);

            /* Currently selected scene object. */
            this._selectedSceneObject = null;
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

        return (Scene);

    }
);
