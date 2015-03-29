define(
    [
        "Core/SceneObject", "Core/Unit"
    ], 

    function(SceneObject, Unit) {

        /**
         * The Mercury scene object.
         */
        function Mercury(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Mercury';
            this._rotationRateRadsPerSec = 0.124001e-5;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(2440), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/mercury.jpg'
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

        Mercury.prototype = Object.create(SceneObject.prototype);

        Mercury.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 40.92316565639546, // daily motion [degrees]
                L: 335.7615455429, // mean longitude [degrees] (M+w+W)
                e: 0.2056270876635018, // eccentricity
                a: 0.3871000780223205, // semi-major axis [AU]
                W: 48.31200797470794, // longitude of ascending node [degrees]
                w: 29.16847841878355, // argument of perifocus [degrees]
                i: 7.004024297684800, // inclination [degrees]
            }
        }

        Mercury.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Mean radius:</td><td>2440(+-1) km</td></tr>',
                    '<tr><td>  Mass, 10<sup>23</sup> kg:</td><td>3.302</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>5.427</td></tr>',
                    '<tr><td>  Sidereal rot. period:</td><td>58.6462 d</td></tr>',
                    '<tr><td>  Mean solar day, days:</td><td>175.9421 d</td></tr>',
                    '<tr><td>  Volume, 10<sup>10</sup> km<sup>3</sup>:</td><td>6.085</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.106</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit:</td><td>2.11\' +/- 0.1\'</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>47.362</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>365.25636 days</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>4.435 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Mercury.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Mercury.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Mercury.prototype.getCloudsMesh = function() { 
            return this.cloudsMesh;
        }

        Mercury.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Mercury);

    }
);
