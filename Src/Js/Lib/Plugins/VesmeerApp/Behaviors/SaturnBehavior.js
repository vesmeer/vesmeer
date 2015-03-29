define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function SaturnBehavior() {
            Behavior.call(this);
        }

        SaturnBehavior.prototype = Object.create(Behavior.prototype);

        SaturnBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.SolarSystem.Sun'
            )
            this.saturn = this.getOwnerSceneObject();
            this.camera = Container.get('camera');
            this.saturn.rotation.x = 26.73 * Math.PI / 180.0;
            
            this.frameNum = 0;
        }

        SaturnBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.saturn.rotateY(
                this.saturn.getRotationRateRadsPerSec() * Time.frameTime);
        }

        return (SaturnBehavior);
    }
);
