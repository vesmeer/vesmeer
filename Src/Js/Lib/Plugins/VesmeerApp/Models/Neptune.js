define(
    [
        "Core/SceneObject", "Core/Unit", 
    ], 

    function(SceneObject, Unit) {

        /**
         * The Neptune scene object.
         */
        function Neptune(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Neptune';
            this._rotationRateRadsPerSec = 1.083e-4;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(24622), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/neptune.jpg'
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
        }

        Neptune.prototype = Object.create(SceneObject.prototype);

        Neptune.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 0.006004214507904047, // daily motion [degrees]
                L: 337.6935493739, // mean longitude [degrees] (M+w+W)
                e: 0.09350912611703428, // eccentricity
                a: 29.98053464816941, // semi-major axis [AU]
                W: 131.8131859079, // longitude of ascending node [degrees]
                w: 292.8255203523, // argument of perifocus [degrees]
                i: 1.771844567754025, // inclination [degrees]
            }
        }

        Neptune.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Equator radius (1 bar):</td><td>24766+-15 km</td></tr>',
                    '<tr><td>  Mass, 10<sup>24</sup> kg:</td><td>102.41</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>1.638</td></tr>',
                    '<tr><td>  Rotational period:</td><td>16.11+-0.01 hr</td></tr>',
                    '<tr><td>  Atmospheric temperature:</td><td>72+-2 K</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.41</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit, deg:</td><td>9.56</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>5.4778</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>60190.029 d</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>23.5 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }


        Neptune.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Neptune.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Neptune.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Neptune);

    }
);
