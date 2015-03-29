define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function VenusBehavior() {
            Behavior.call(this);
        }

        VenusBehavior.prototype = Object.create(Behavior.prototype);

        VenusBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun')
            this.venus = this.getOwnerSceneObject();
            this.camera = Container.get('camera');
            this.venus.rotation.x = 177.36 * Math.PI / 180.0;
            this.frameNum = 0;
        }

        VenusBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.venus.rotateY(
                this.venus.getRotationRateRadsPerSec() * Time.frameTime);
            this.venus.atmosphereMesh.material.uniforms.viewVector.value =
                this.venus.worldToLocal(this.camera.position.clone());
            this.venus.atmosphereMesh.material.uniforms.lightVector.value = 
                this.venus.worldToLocal(this.sun.position.clone());
        }

        return (VenusBehavior);
    }
);
