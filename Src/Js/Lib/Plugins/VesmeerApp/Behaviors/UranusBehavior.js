define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function UranusBehavior() {
            Behavior.call(this);
        }

        UranusBehavior.prototype = Object.create(Behavior.prototype);

        UranusBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.SolarSystem.Sun')
            this.uranus = this.getOwnerSceneObject();
            this.uranus.rotation.x = 97.77 * Math.PI / 180.0;
            
            this.frameNum = 0;
        }

        UranusBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.uranus.rotateY(
                this.uranus.getRotationRateRadsPerSec() * Time.frameTime);
        }

        return (UranusBehavior);
    }
);
