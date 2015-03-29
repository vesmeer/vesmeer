define(
    [
        "Core/SceneObject", "Core/Unit", 
        "Plugins/VesmeerApp/Shaders/MarsAtmosphereShader"
    ], 

    function(SceneObject, Unit, MarsAtmosphereShader) {

        /**
         * The Mars scene object.
         */
        function Mars(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Mars';
            this._rotationRateRadsPerSec = 7.088218e-5;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(3390), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/mars.jpg'
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
                    uniforms: MarsAtmosphereShader.uniforms,
                    vertexShader: MarsAtmosphereShader.vertexShader,
                    fragmentShader: MarsAtmosphereShader.fragmentShader,
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

        Mars.prototype = Object.create(SceneObject.prototype);

        Mars.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 0.5240324455760620, // daily motion [degrees]
                L: 344.2650993419, // mean longitude [degrees] (M+w+W)
                e: 0.09350912611703428, // eccentricity
                a: 1.523692434408699, // semi-major axis [AU]
                W: 49.51333641175469, // longitude of ascending node [degrees]
                w: 286.5512082908292, // argument of perifocus [degrees]
                i: 1.523692434408699, // inclination [degrees]
            }
        }

        Mars.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Mean radius:</td><td>3389.9(2+-4) km</td></tr>',
                    '<tr><td>  Mass, 10<sup>23</sup> kg:</td><td>6.4185</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>3.933(5+-4)</td></tr>',
                    '<tr><td>  Sidereal rot. period:</td><td>24.622962 hr</td></tr>',
                    '<tr><td>  Mean solar day, days:</td><td>1.0274907</td></tr>',
                    '<tr><td>  Mean temperature, K:</td><td>210</td></tr>',
                    '<tr><td>  Atm. pressure:</td><td>0.0056 bar</td></tr>',
                    '<tr><td>  Volume, 10<sup>10</sup> km<sup>3</sup>:</td><td>16.318</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.150 </td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit, deg:</td><td>25.19</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>24.1309</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>365.25636 days</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>5.027 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Mars.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Mars.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Mars.prototype.getCloudsMesh = function() { 
            return this.cloudsMesh;
        }

        Mars.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Mars);

    }
);
