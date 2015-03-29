define(
    [
        "THREE", "TWEEN", "Core/Time", "Core/SceneObject"
    ],

    function(THREE, TWEEN, Time, SceneObject) {

        /**
         * Provides manipulation routines for the given camera.
         */
        function CameraControls(camera, rootSceneObject) {

            /* The camera to which these utility functions will be applied. */
            this._camera = camera;

            /* The speed at which camera translations will take place. */
            this._translationSpeed = 0;

            /* If true, the call to dolly will translate the camera forwards,
             * otherwise it will translate it backwards. */
            this._dollyForward = true;

            /* The camera will follow (move with) this scene object, 
             * if not null. */
            this._followedObject = null;

            /* The camera will track (continuously look at) at this 
             * scene object, if not null. */
            this._trackedObject = null;

            /* Previous frame position of the followed object. */
            this._followedObjectPrevPos = null;

            /* Previous frame position of the followed object. */
            this._followedObjectPrevPos = null;

            /* The scene object that is at the root level and therefore
             * contains the other scene objects within it. */
            this._rootSceneObject = rootSceneObject;
        }

        CameraControls.prototype.update = function() {
            this._followObject();
            this._trackObject();
            this._dolly();
        }

        CameraControls.prototype.toggleDollyDirection = function() {
            this._dollyForward = !this._dollyForward;
        }

        /**
         * Moves the camera back or forth depending on the sign of the
         * _translationSpeed property.
         */
        CameraControls.prototype._dolly = function() {
            if (this._translationSpeed == 0) return;

            this.clampCameraDistanceFromOrigin();
            
            if (this._dollyForward) {
                this._camera.translateZ(
                    -this._translationSpeed * Time.frameTime);
            }
            else {
                this._camera.translateZ(
                    this._translationSpeed * Time.frameTime);
            }
            // this._rootSceneObject.position.add(worldDisplacement.clone());
        }

        CameraControls.prototype.setTranslationSpeed = function(speed) {
            this._translationSpeed = speed;
        }

        CameraControls.prototype.getTranslationSpeed = function() {
            return this._translationSpeed;
        }

        CameraControls.prototype.increaseTranslationSpeed = function(addend) {
            this._translationSpeed += addend;
        }

        CameraControls.prototype.getFollowedObject = function() {
            return this._followedObject;
        }

        CameraControls.prototype.getStatus = function() {
            return this.status = {
                FollowingObject: this._followedObject !== null,
                TrackingObject: this._trackedObject !== null,
            }
        }

        CameraControls.prototype.trackObject = function(sceneObject) {
            this._trackedObject = sceneObject;
        }

        CameraControls.prototype._trackObject = function() {
            if (this.getStatus().TrackingObject) {
                this.lookAt(this._trackedObject.position);
            }
        }

        /**
         * Makes the camera follow the scene object, meaning the camera
         * moves with the scene object (the camera's rest frame is the
         * object's reference frame).
         */
        CameraControls.prototype.followObject = function(sceneObject) {
            this._followedObject = sceneObject;
            this._followedObjectPrevPos = null;
        }

        CameraControls.prototype._followObject = function() {
            if (!this.getStatus().FollowingObject) return;
            if (this._followedObjectPrevPos == null) {
                this._setFollowSceneObjectPrevPos();
                return;
            }

            var followedObjectPos = new THREE.Object3D().localToWorld(
                this._followedObject.position.clone());
            var displacement = new THREE.Vector3().subVectors(
                followedObjectPos,
                this._followedObjectPrevPos.clone()
            );
            
            this._camera.position.add(displacement.clone());
            this._setFollowSceneObjectPrevPos();
        }

        CameraControls.prototype._setFollowSceneObjectPrevPos = function() {
            this._followedObjectPrevPos = 
                new THREE.Object3D().localToWorld(
                    this._followedObject.position.clone());
        }

        /**
         * Points the camera at the point in world space given by targetPosition.
         */
        CameraControls.prototype.lookAt = function(targetPosition, durationMs, onComplete) {
            var targetPos = this._camera.worldToLocal(targetPosition.clone());
            var rotationAxis = new THREE.Vector3().crossVectors(
                new THREE.Vector3(0, 0, -1),
                targetPos
            ).normalize();
            var angle = new THREE.Vector3(0, 0, -1).angleTo(
                targetPos.normalize().clone());

            if (durationMs === undefined || durationMs == 0) {
                this._camera.rotateOnAxis(rotationAxis, angle);
            }
            else {
                var self = this;
                var prevAngle = 0;
                var param = {t: 0.0};
                var anim = new TWEEN.Tween(param).to({t: 1.0}, durationMs);
                function updateTween() {
                    var currentAngle = angle * param.t;
                    self._camera.rotateOnAxis(rotationAxis, 
                        currentAngle - prevAngle);
                    prevAngle = currentAngle;
                }
                //anim.easing(TWEEN.Easing.Exponential.Out);
                anim.easing(TWEEN.Easing.Quadratic.InOut);
                anim.onUpdate(updateTween);
                anim.onComplete(onComplete);
                anim.start();
            }
        }

        /**
         * Positions the camera near the object. Calls onComplete 
         * callback once the camera reaches the destination.
         */
        CameraControls.prototype.goToObject = function(sceneObject, onComplete) {
            this.lookAt(
                SceneObject.localToWorld(sceneObject), 
                700, 
                function() {}
            );
            var self = this;
            var targetPos = this._findObjectViewingPosition(sceneObject);
            var displacement = new THREE.Vector3().subVectors(
                this._camera.position.clone(),
                targetPos
            );
            var worldTargetPos = new THREE.Vector3().addVectors(
                this._rootSceneObject.position.clone(),
                displacement
            );
            //TWEEN.removeAll(); // remove previous tweens if needed
            var param = {t: 0.0};
            var anim = new TWEEN.Tween(param).to({t: 1.0}, 2000);
            function updateTween() {
                var currentPosition = 
                    self._rootSceneObject.position.clone().lerp(
                        worldTargetPos.clone(), 
                        param.t
                    );
                self._rootSceneObject.position.copy(currentPosition);
            }
            anim.easing(TWEEN.Easing.Sinusoidal.In);
            anim.onUpdate(updateTween);
            anim.onComplete(onComplete);
            anim.start();
        }

        /**
         * Sets the camera to the position by moving the world in
         * the opposite direction. This prevents the camera from getting
         * too far from the origin of the coordinate system, thereby avoiding
         * problems with z-buffer precission.
         */
        CameraControls.prototype.setPosition = function(position) {
            var displacement = new THREE.Vector3().subVectors(
                this._camera.position,
                position.clone());
            this._rootSceneObject.position.add(displacement);
        }

        /**
         * Returns the position of the point in space where the camera should 
         * reach when the "go to scene object" command is issued.
         */
        CameraControls.prototype._findObjectViewingPosition = function(sceneObject) {
            var selectedObjPos = SceneObject.localToWorld(sceneObject);
            
            return selectedObjPos.add(
                this._camera.position.clone().sub(selectedObjPos)
                    .normalize()
                    .multiplyScalar(sceneObject.getMeshes()[0]
                        .geometry.boundingSphere.radius * 4)
            );
        }
        
        /**
         * Makes the camera orbit the scene object at the given rate [deg/s].
         *
         * TODO: This function is incomplete. It doesn't work properly when
         * the camera doesn't initially face the scene object.
         */
        CameraControls.prototype.orbitObject = function(sceneObject, orbitRate) {
            var selectedObjWorldPos = SceneObject.localToWorld(sceneObject);
            var sceneObjectToCameraVec = new THREE.Vector3().subVectors(
                this._camera.position.clone(),
                selectedObjWorldPos.clone()
            );
            var sceneObjectToCameraDistance = sceneObjectToCameraVec.length();
            // var angleCamLookingVecToCamSceneObjVec = 
            //         this.getCameraLookingDirection(camera).angleTo(
            //             new THREE.Vector3().subVectors(
            //                 selectedObjWorldPos.clone(), 
            //                 this._camera.position.clone()
            //             )
            //         );
            this._camera.position.copy(selectedObjWorldPos);
            //this._camera.translateZ(sceneObjectToCameraDistance);
            // var cameraLookingAngle = new THREE.Vector3().subVectors(
            //     camera.position.clone(),
            //     selectedObjWorldPos.clone()
            // ).angleTo(sceneObjectToCameraVec);
            //this._camera.translateZ(-sceneObjectToCameraDistance);
            //this._camera.rotateX(-cameraLookingAngle);
            this._camera.rotateY(orbitRate * Math.PI / 180 * Time.frameTime);
            this._camera.translateZ(sceneObjectToCameraDistance);
            //this._camera.rotateX(cameraLookingAngle);
        }

        /**
         * Returns a unit vector pointing in the direction in which the camera
         * is looking.
         */
        CameraControls.prototype.getCameraLookingDirection = function() {
          // var pointLocal = new THREE.Vector3(0, 0, -1);
          // var pointWorld = pointLocal.applyMatrix4(this._camera.matrixWorld);

          // return pointWorld.sub(this._camera.position.clone()).normalize();

            var vector = new THREE.Vector3(0, 0, -1);
            vector.applyQuaternion(this._camera.quaternion);
            
            return vector;
        }

        /**
         * Draws a line starting at startPosition and ending at endPosition.
         */
        CameraControls.prototype.drawLine = function(ownerObject, 
                startPosition, endPosition) {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth: 2
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(startPosition.clone());
            geometry.vertices.push(endPosition.clone());
            var line = new THREE.Line(geometry, material);
            ownerObject.add(line);
        }

        /**
         * Shifts the camera from its current position to the origin
         * of the coordinate system and shifts the scene in the same
         * direction correspondingly to make it look like the camera
         * wasn't shifted. The camera repositioning is done in order
         * to prevent the camera from being positioned too far from
         * the origin of the coordinate system, where coordinate precission
         * errors in the z-buffer significantly effect scene object 
         * positioning and rendering.
         */
        CameraControls.prototype.clampCameraDistanceFromOrigin = function() {
            if (this._camera.position.length() > 10000000) {
                var displacement = this._camera.position.clone();
                this._rootSceneObject.position.sub(displacement);
                this._camera.position.sub(displacement);
            }
        }

        /**
         * Rotates the camera on its z-axis.
         *
         * @param rate The rate of rotation [deg/s].
         */
        CameraControls.prototype.rotateZ = function(rate) {
            this._camera.rotateZ(rate * Math.PI / 180 * Time.frameTime);
        }

        /**
         * Rotates the camera on its x-axis.
         *
         * @param rate The rate of rotation [deg/s].
         */
        CameraControls.prototype.rotateX = function(rate) {
            this._camera.rotateX(rate * Math.PI/180 * Time.frameTime);
        }

        // /**
        //  * Returns a unit vector pointing in the same direction
        //  * in which the camera is looking in the world coordinates.
        //  */
        // CameraControls.prototype.findLookingVector = function() {
        //     var vector = new THREE.Vector3(0, 0, -1);
        //     vector.applyQuaternion(this._camera.quaternion);
            
        //     return vector;
        // }

        return (CameraControls);
    }
);
