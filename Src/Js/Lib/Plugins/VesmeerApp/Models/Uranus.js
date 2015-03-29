define(
    [
        "Core/SceneObject", "Core/Unit", 
    ], 

    function(SceneObject, Unit) {

        /**
         * The Uranus scene object.
         */
        function Uranus(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Uranus';
            this._rotationRateRadsPerSec = -1.012e-4;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(25362), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/uranus.jpg'
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

        Uranus.prototype = Object.create(SceneObject.prototype);

        Uranus.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 0.01174618537984963, // daily motion [degrees]
                L: 17.6112610561, // mean longitude [degrees] (M+w+W)
                e: 0.09350912611703428, // eccentricity
                a: 19.16657308339588, // semi-major axis [AU]
                W: 73.9256085998, // longitude of ascending node [degrees]
                w: 96.328962391, // argument of perifocus [degrees]
                i: 0.7724492905826467, // inclination [degrees]
            }
        }

        Uranus.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Mean radius (1 bar):</td><td>25559+-4 km</td></tr>',
                    '<tr><td>  Mass, 10<sup>24</sup> kg:</td><td>86.8103</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>1.318</td></tr>',
                    '<tr><td>  Rotational period:</td><td>17.24+-0.01 hr</td></tr>',
                    '<tr><td>  Atmospheric temperature, K:</td><td>76+-2</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.51</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit, deg:</td><td>97.86</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>6.8352</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>30687.153 d</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>21.3 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Uranus.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Uranus.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Uranus.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Uranus);

    }
);
