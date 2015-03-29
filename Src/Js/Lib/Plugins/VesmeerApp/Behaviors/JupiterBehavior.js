define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function JupiterBehavior() {
            Behavior.call(this);
        }

        JupiterBehavior.prototype = Object.create(Behavior.prototype);

        JupiterBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun')
            this.jupiter = this.getOwnerSceneObject();
            this.camera = Container.get('camera');
            this.jupiter.rotation.x = 3.13 * Math.PI / 180.0;
            
            this.frameNum = 0;
        }

        JupiterBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.jupiter.rotateY(
                this.jupiter.getRotationRateRadsPerSec() * Time.frameTime);
            this.jupiter.atmosphereMesh.material.uniforms.viewVector.value =
                this.jupiter.worldToLocal(this.camera.position.clone());
            this.jupiter.atmosphereMesh.material.uniforms.lightVector.value = 
                this.jupiter.worldToLocal(this.sun.position.clone());

        }

        return (JupiterBehavior);
    }
);
