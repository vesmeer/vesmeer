define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function MercuryBehavior() {
            Behavior.call(this);
        }

        MercuryBehavior.prototype = Object.create(Behavior.prototype);

        MercuryBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun')
            this.mercury = this.getOwnerSceneObject();
            this.mercury.rotation.x = 2.11 / 60 * Math.PI / 180.0;
            this.camera = Container.get('camera');
            
            this.frameNum = 0;
        }

        MercuryBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.mercury.rotateY(
                this.mercury.getRotationRateRadsPerSec() * Time.frameTime);
        }

        return (MercuryBehavior);
    }
);
