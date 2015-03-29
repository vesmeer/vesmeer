define(
    [
        "Core/SceneObject", "Core/Unit", 
        "Plugins/VesmeerApp/Models/SolarSystem"
    ], 

    function(SceneObject, Unit, SolarSystem) {

        /**
         * The star dome (spherical skybox) scene object.
         */
        function StarDome(name) {
            SceneObject.call(this, name);

            this.label = 'Star Dome';
            this.starsMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(10e15), 60, 40),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/milky_way.jpg'
                    ),
                    side: THREE.BackSide
                })
            );
            this.setName(this.starsMesh, 'Stars');
            this.opacityMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(10e15 - 100), 60, 40),
                new THREE.MeshLambertMaterial({ 
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.0,
                    side: THREE.BackSide
                })
            );
            this.setName(this.opacityMesh, 'Opacity');
            // this.starsMesh.scale.set(-1, 1, 1);
            // this.starsMesh.eulerOrder = 'XZY';
            this.starsMesh.rotateZ(62.6 * Math.PI / 180);
            this.starsMesh.rotateX(175 * Math.PI / 180);
            this.starsMesh.rotateY(-270 * Math.PI / 180);
            // this.starsMesh.rotation.x = Math.PI;
            // this.starsMesh.renderDepth = 10000.0;

            //this.add( new THREE.AxisHelper(50000 * 1.5) );
            this.add(this.starsMesh);
            this.add(this.opacityMesh);

            this.add(new SolarSystem(this.name + '.SolarSystem'));
        }

        StarDome.prototype = Object.create(SceneObject.prototype);

        StarDome.prototype.getBrightness = function() {
            return 1.0 - this.opacityMesh.material.opacity;
        }
        
        /**
         * Sets the star dome brightness, which effectively changes
         * the brightness and, thereby, number of visible stars. Values
         * range between 0 and 1.
         */
        StarDome.prototype.setBrightness = function(value) {
            this.opacityMesh.material.opacity = 1.0 - value;
        }

        StarDome.prototype.getMesh = function() { 
            return this.starsMesh;
        }

        StarDome.prototype.getMeshes = function() {
            return [this.starsMesh, this.opacityMesh];
        }

        return (StarDome);

    }
);
