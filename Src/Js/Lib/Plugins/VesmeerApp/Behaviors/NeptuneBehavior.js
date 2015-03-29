define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function NeptuneBehavior() {
            Behavior.call(this);
        }

        NeptuneBehavior.prototype = Object.create(Behavior.prototype);

        NeptuneBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.SolarSystem.Sun'
            )
            this.neptune = this.getOwnerSceneObject();
            this.neptune.rotation.x = 28.32 * Math.PI / 180.0;
            
            this.frameNum = 0;
        }

        NeptuneBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.neptune.rotateY(
                this.neptune.getRotationRateRadsPerSec() * Time.frameTime);
        }

        return (NeptuneBehavior);
    }
);
