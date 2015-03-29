define(
    [
        "THREE", "Utils/Utils"
    ],

    function(THREE, Utils) {

        /**
         * The scene object base class.
         */
        function SceneObject(name) {
            THREE.Object3D.call(this);
            /* A unique name. */
            this.name = name;

            /* A human friendly label. */
            this.label = '';

            /* The object's description. */
            this.description = '';

            /* The object's rotational rate in radians/s. */
            this._rotationRateRadsPerSec = 0;

            /* Behavior objects associated with this scene object. */
            this.behaviors = [];
        }

        /**
         * Returns the position of the scene object in the world coordinates.
         */
        SceneObject.localToWorld = function(sceneObject) {
            var positionWorld = new THREE.Vector3();
            positionWorld.setFromMatrixPosition(sceneObject.matrixWorld);

            return positionWorld;
        }

        SceneObject.prototype = Object.create(THREE.Object3D.prototype);

        SceneObject.prototype.getDescription = function() {
            return this.description;
        }
        
        SceneObject.prototype.addBehavior = function(behavior) {
            behavior.setOwnerSceneObject(this);
            this.behaviors.push(behavior);
        }

        SceneObject.prototype.getBehaviors = function() {
            return this.behaviors;
        }

        SceneObject.prototype.getMeshes = function() {
            return [];
        }

        SceneObject.prototype.getLights = function() {
            return [];
        }

        /**
         * Sets the name of the given scene object component. The container
         * object's name is set in the constructor instead.
         */
        SceneObject.prototype.setName = function(component, name) {
            component.name = this._getFullName(name);
        }

        SceneObject.prototype._getFullName = function(name) {
            return this.name + '.' + name;
        }

        /**
         * Toggles on and off axis visualization of this scene object.
         */
        SceneObject.prototype.toggleAxisHelper = function() {
            var axisHelper = this.getObjectByName(
                this.name + ".AxisHelper", true);
            if (axisHelper === undefined) {
                var axisHelper = new THREE.AxisHelper(
                    this.getMeshes()[0].geometry.boundingSphere.radius * 3);
                this.setName(axisHelper, "AxisHelper");
                this.add(axisHelper);
            }
            else {
                this.remove(axisHelper);
            }
        }

        /**
         * Returns true if the axis helper is turn on and showing
         * for this scene object.
         */
        SceneObject.prototype.isAxisHelperActive = function() {
            var axisHelper = this.getObjectByName(
                this.name + ".AxisHelper", true);
            return axisHelper !== undefined;
        }

        /**
         * Returns the distance in raw units from the camera camera position 
         * to the surface (outermost) mesh of the scene object.
         */
        SceneObject.prototype.findDistanceToSurface = function(camera) {
            // var objPos = new THREE.Object3D().localToWorld(
            //     this.position.clone());
            var objPos = SceneObject.localToWorld(this);
            // var cameraPos = new THREE.Object3D().localToWorld(
            //     camera.position.clone());
            var cameraPos = SceneObject.localToWorld(camera);
            var centerToMeshDist = 0;

            if (this.getMeshes().length > 0) {
                if (this.getMeshes()[0].geometry instanceof THREE.SphereGeometry) {
                    centerToMeshDist = this.getMeshes()[0]
                        .geometry.boundingSphere.radius;
                }
            }

            return objPos.sub(cameraPos).length() - centerToMeshDist;
        }

        /**
         * Toggles the object's equatorial plane helper on and off.
         */
        SceneObject.prototype.toggleEquatorialPlane = function() {
            var equitorialPlane = this.getObjectByName(
                this.name + ".EquitorialPlane", true);
            if (this.isEquatorialPlaneOn() === false) {
                var equitorialPlane = this._createEquatorialPlane(
                    this._computeEquatorialPlaneWidth(), 
                    0xCECECE
                );
                this.setName(equitorialPlane, 'EquitorialPlane');
                equitorialPlane.rotateX(90 * Math.PI / 180.0);
                this.add(equitorialPlane);
            }
            else {
                this.remove(equitorialPlane);
            }
        }

        SceneObject.prototype._computeEquatorialPlaneWidth = function() {
            var objectRadius;
            // If the scene object has geometry, use its radius to define the
            // width of the plane, otherwise set it to a very large number.
            if (this.getMeshes().length > 0) {
                objectRadius = this.getMeshes()[0]
                    .geometry.boundingSphere.radius * 10000;
            }
            else {
                objectRadius = 10e8;
            }

            return objectRadius * 2;
        }

        SceneObject.prototype._createEquatorialPlane = function(width, color) {
            return new THREE.Mesh(
                new THREE.PlaneBufferGeometry(width, width, 300, 300),
                new THREE.MeshBasicMaterial({
                    wireframe: true,
                    color: color, 
                    side: THREE.DoubleSide
                })
            );
        }

        /**
         * Returns true if the object's equatorial plane is turned on.
         */
        SceneObject.prototype.isEquatorialPlaneOn = function() {
            var equitorialPlane = this.getObjectByName(
                this.name + ".EquitorialPlane", true);
            return equitorialPlane !== undefined;
        }

        SceneObject.prototype.getRotationRateRadsPerSec = function() {
            return this._rotationRateRadsPerSec;
        }

        return (SceneObject);
    }

);
