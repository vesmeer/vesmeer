define(
    [
        "Core/SceneObject", "Core/Unit", "Core/Geometries/RingGeometry"
    ], 

    function(SceneObject, Unit, RingGeometry) {

        /**
         * The Saturn scene object.
         */
        function Saturn(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Saturn';
            this._rotationRateRadsPerSec = 1.63785e-4;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(58232), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/saturn.jpg'
                    ),
                    // bumpMap: THREE.ImageUtils.loadTexture(
                    //     'Assets/VesmeerApp/Textures/marsbump.jpg'
                    // ),
                    // bumpScale:   0.005,
                    // specularMap: THREE.ImageUtils.loadTexture('images/water_8k.png'),
                    // specular: new THREE.Color('gray'),
                    // map: THREE.ImageUtils.loadTexture('images/fair_clouds_8k.jpg'),
                    // transparent: true,
                    shininess: 10
                })
            );
            this.surfaceMesh.receiveShadow = true;
            this.surfaceMesh.castShadow = true;
            this.surfaceMesh.needsUpdate = true;
            this.setName(this.surfaceMesh, 'Surface');
            this.add(this.surfaceMesh);

            this.rings = this.createRings();
            this.setName(this.rings, 'Rings');
            this.add(this.rings);
        }

        Saturn.prototype = Object.create(SceneObject.prototype);

        Saturn.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 0.03341577209439570, // daily motion [degrees]
                L: 233.1009125271, // mean longitude [degrees] (M+w+W)
                e: 0.05426689563501208, // eccentricity
                a: 9.547208988394067, // semi-major axis [AU]
                W: 113.5719346639176, // longitude of ascending node [degrees]
                w: 339.7989654152281, // argument of perifocus [degrees]
                i: 2.487911257762663, // inclination [degrees]
            }
        }

        Saturn.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Mean radius:</td><td>60268+-4 km</td></tr>',
                    '<tr><td>  Mass, 10<sup>26</sup> kg:</td><td>5.68319</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>0.687+-.001</td></tr>',
                    '<tr><td>  Sidereal rot. period:</td><td>29.447498 yr</td></tr>',
                    '<tr><td>  Inferred rot. period:</td><td>10.61+-0.02 hr</td></tr>',
                    '<tr><td>  Atm. temperature, K:</td><td>134+-4 K</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.47</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit:</td><td>26.73 deg</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>9.6624</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>10755.698 d</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>35.5 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Saturn.prototype.createRings = function() {
            var geometry = new RingGeometry(
                Unit.dist(58232+11200), 
                Unit.dist(58232+11200+65000), 
                Unit.dist(128)
            );
            // Use MeshPhongMaterial to turn on shadow receiving and casting
            // by the rings.
            //var material = new THREE.MeshPhongMaterial({
            var material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(
                    'Assets/VesmeerApp/Textures/saturnringcolor.png'
                ),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
            })
            var mesh = new THREE.Mesh(geometry, material)
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.needsUpdate = true;
            
            // mesh.lookAt(new THREE.Vector3(0.5,-4,1))
            mesh.lookAt(new THREE.Vector3(0,1,0))
        
            return mesh
        }

        Saturn.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Saturn.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Saturn.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Saturn);

    }
);
