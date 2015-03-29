define(
    [
        "Core/SceneObject", "Core/Unit", "Core/Container"
    ], 

    function(SceneObject, Unit, Container) {

        /**
         * The moon scene object.
         */

        function Moon(name) {
            SceneObject.call(this, name);

            this.label = 'Moon';
            this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(1737.5), 45, 45),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/moon.jpg'
                    ),
                    //transparent: true
                })
            );
            this.mesh.receiveShadow = true;
            this.mesh.castShadow = true;
            this.setName(this.mesh, 'Surface');
            this.add(this.mesh);
        }

        Moon.prototype = Object.create(SceneObject.prototype);

        Moon.prototype.getMeshes = function() {
            return [this.mesh];
        }

        return (Moon);
    }
);
