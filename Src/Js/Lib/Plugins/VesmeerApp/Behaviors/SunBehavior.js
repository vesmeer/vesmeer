define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function SunBehavior() {
            Behavior.call(this);
        }

        SunBehavior.prototype = Object.create(Behavior.prototype);

        SunBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.earth = this.scene.findObjectByName(
                'VesmeerApp.SolarSystem.Earth');
            // this.ownerSceneObject.rotation.z = 7.25 * Math.PI / 180.0;
            this.ownerSceneObject.position = new THREE.Vector3(0, 0, 0);
            this.start = Date.now();
        }

        SunBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.ownerSceneObject.surfaceMesh.material.uniforms['time'].value = 
                .000025 * (Date.now() - this.start);
            //this.ownerSceneObject.rotation.y += Math.PI / 50.0 * Time.frameTime;
        }

        return (SunBehavior);
    }
);
