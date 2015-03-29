define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function MarsBehavior() {
            Behavior.call(this);
        }

        MarsBehavior.prototype = Object.create(Behavior.prototype);

        MarsBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun')
            this.mars = this.getOwnerSceneObject();
            this.mars.rotation.x = 25.19 * Math.PI / 180.0;
            this.camera = Container.get('camera');
            
            this.frameNum = 0;
        }

        MarsBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.mars.rotateY(
                this.mars.getRotationRateRadsPerSec() * Time.frameTime);
            this.mars.atmosphereMesh.material.uniforms.viewVector.value =
                this.mars.worldToLocal(this.camera.position.clone());
            this.mars.atmosphereMesh.material.uniforms.lightVector.value = 
                this.mars.worldToLocal(this.sun.position.clone());
        }

        return (MarsBehavior);
    }
);
