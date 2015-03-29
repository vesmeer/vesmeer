define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings", "Core/Unit"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, Unit) {

        function EarthBehavior() {
            Behavior.call(this);
        }

        EarthBehavior.prototype = Object.create(Behavior.prototype);

        EarthBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun'
            )
            this.earth = this.getOwnerSceneObject();
            this.earth.rotation.x = 23.4 * Math.PI / 180.0;
            this.camera = Container.get('camera');
            // this.moon = this.scene.findObjectByName(
            //     'VesmeerApp.StarDome.SolarSystem.Moon'
            // )
            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun'
            )
            // this.moon.position.copy(this.earth.position.clone().sub(
            //     new THREE.Vector3(
            //         Unit.dist(0), 
            //         Unit.dist(10000), 
            //         Unit.dist(384000)
            //     )
            // ));
            
            this.frameNum = 0;
        }

        EarthBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.frameNum += 1;
            this.earth.rotateY(
                this.earth.getRotationRateRadsPerSec() * Time.frameTime);
            this.earth.atmosphereMesh.material.uniforms.viewVector.value =
                this.earth.worldToLocal(this.camera.position.clone());
            this.earth.atmosphereMesh.material.uniforms.lightVector.value = 
                this.earth.worldToLocal(this.sun.position.clone());
        }

        return (EarthBehavior);
    }
);
