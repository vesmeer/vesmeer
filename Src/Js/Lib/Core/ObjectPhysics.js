define(
    [
        "THREE", "Core/Time", "Plugins/VesmeerApp/Settings",
    ],

    function(THREE, Time, Settings, Container) {

        /**
         * Tracks and provides access to physical properties of scene
         * objects that are not implemented directly in THREE.Object3D
         * (such as velocity).
         */
        function ObjectPhysics() {
            /* Map of scene objects and their tracked properties. Structure: 
               { 
                    objectName: {
                        obj: object,
                        prevPosition: previous_position,
                        velocity: velocity
                    }
                }
             */
            this._objects = {};
        }

        /**
         * Sets root scene object needed for position calculations.
         */
        ObjectPhysics.prototype.setRootSceneObject = function(rootSceneObject) {
            this.rootSceneObject = rootSceneObject;
        }

        /**
         * Registers a scene object for continuous computing of its dynamic
         * physical properties (e.g. velocity, position).
         */
        ObjectPhysics.prototype.registerObject = function(object) {
            this._objects[object.name] = {
                obj: object, 
                prevPosition: new THREE.Vector3(),
                velocity: new THREE.Vector3()
            }
        }

        ObjectPhysics.prototype.getSpeed = function(objectName, precision) {
            if (precision === undefined) precision = 2;

            var obj = this._objects[objectName];

            return (Math.sqrt(
                Math.pow(obj.velocity.x, 2) +
                Math.pow(obj.velocity.y, 2) +
                Math.pow(obj.velocity.z, 2)
            )).toFixed(precision);
        }

        /**
         * Updates the physical quantities that are time dependent (such
         * as object velocity).
         */
        ObjectPhysics.prototype.update = function() {
            for(var objName in this._objects) {
                var objPos = this.getPosition(this._objects[objName]);
                this._computeVelocity(this._objects[objName], objPos);
                this._setPreviousPosition(this._objects[objName], objPos);
            }
        }

        ObjectPhysics.prototype._setPreviousPosition = function(object, objectPosition) {
            object.prevPosition.copy(objectPosition);
        }

        ObjectPhysics.prototype._computeVelocity = function(object, objectPosition) {
            object.velocity.x = (objectPosition.x - object.prevPosition.x) / 
                Time.frameTime;
            object.velocity.y = (objectPosition.y - object.prevPosition.y) / 
                Time.frameTime;
            object.velocity.z = (objectPosition.z - object.prevPosition.z) / 
                Time.frameTime;
        }

        /**
         * Returns the object position relative to the rootSceneObject
         * scene object position.
         */
        ObjectPhysics.prototype.getPosition = function(object) {
            return new THREE.Vector3().subVectors(
                object.obj.position.clone(),
                this.rootSceneObject.position.clone()
            );
        }

        return (ObjectPhysics);
    }
);
