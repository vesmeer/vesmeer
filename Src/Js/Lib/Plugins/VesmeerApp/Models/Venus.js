define(
    [
        "Core/SceneObject", "Core/Unit", 
        "Plugins/VesmeerApp/Shaders/VenusAtmosphereShader"
    ], 

    function(SceneObject, Unit, VenusAtmosphereShader) {

        /**
         * The Venus scene object.
         */
        function Venus(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Venus';
            this._rotationRateRadsPerSec = -0.029924e-5;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(6052), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/venus.jpg'
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
            
            this.atmosphereMesh = new THREE.Mesh(
                this.surfaceMesh.geometry.clone(),
                new THREE.ShaderMaterial({
                    uniforms: VenusAtmosphereShader.uniforms,
                    vertexShader: VenusAtmosphereShader.vertexShader,
                    fragmentShader: VenusAtmosphereShader.fragmentShader,
                    side: THREE.FrontSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true
                })
            );
            this.atmosphereMesh.position = this.surfaceMesh.position;
            this.atmosphereMesh.scale.multiplyScalar(1.008);
            this.setName(this.atmosphereMesh, 'Atmosphere');
            this.add(this.atmosphereMesh);
        }

        Venus.prototype = Object.create(SceneObject.prototype);

        Venus.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 1.602128541056361, // daily motion [degrees]
                L: 312.604073072, // mean longitude [degrees] (M+w+W)
                e: 0.006750623935281078, // eccentricity
                a: 0.7233328109473037, // semi-major axis [AU]
                W: 76.64011879934985, // longitude of ascending node [degrees]
                w: 54.60054162370661, // argument of perifocus [degrees]
                i: 3.394477033761428, // inclination [degrees]
            }
        }

        Venus.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Mean radius:</td><td>6051.8(4+-1) km</td></tr>',
                    '<tr><td>  Mass, 10<sup>23</sup> kg:</td><td>48.685</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>5.204</td></tr>',
                    '<tr><td>  Sidereal rot. period:</td><td>-243.0185 d</td></tr>',
                    '<tr><td>  Mean solar day, days:</td><td>116.7490 d</td></tr>',
                    '<tr><td>  Mean Temperature, K:</td><td>735</td></tr>',
                    '<tr><td>  Atm. pressure:</td><td>90 bar</td></tr>',
                    '<tr><td>  Volume, 10<sup>10</sup> km<sup>3</sup>:</td><td>92.843</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.65</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit:</td><td>177.3 deg</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>35.0214</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>224.70079922 d</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>10.361 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Venus.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Venus.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Venus.prototype.getCloudsMesh = function() { 
            return this.cloudsMesh;
        }

        Venus.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Venus);

    }
);
