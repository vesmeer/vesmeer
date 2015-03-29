define(
    [
        "Core/SceneObject", "Core/Unit",
        "Plugins/VesmeerApp/Shaders/JupiterAtmosphereShader"
    ], 

    function(SceneObject, Unit, JupiterAtmosphereShader) {

        /**
         * The Jupiter scene object.
         */
        function Jupiter(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();

            this.label = 'Jupiter';
            this._rotationRateRadsPerSec = 1.75865e-4;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(69911), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/jupiter.jpg'
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
                    uniforms: JupiterAtmosphereShader.uniforms,
                    vertexShader: JupiterAtmosphereShader.vertexShader,
                    fragmentShader: JupiterAtmosphereShader.fragmentShader,
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

        Jupiter.prototype = Object.create(SceneObject.prototype);

        Jupiter.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 0.08310409860536942, // daily motion [degrees]
                L: 129.2495423069, // mean longitude [degrees] (M+w+W)
                e: 0.04890542164478658, // eccentricity
                a: 5.202266241837633, // semi-major axis [AU]
                W: 100.5138785634844, // longitude of ascending node [degrees]
                w: 273.8115849522147, // argument of perifocus [degrees]
                i: 1.303732793787982, // inclination [degrees]
            }
        }

        Jupiter.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Jupiter.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Equator radius (1 bar), km:</td><td>71492+-4</td></tr>',
                    '<tr><td>  Mass, 10<sup>24</sup> kg:</td><td>1898.13+-.19</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>1.326</td></tr>',
                    '<tr><td>  Rot. period, hr:</td><td>9h 55m 29.685s</td></tr>',
                    '<tr><td>  Atm. temperature (1 bar), K:</td><td>165+-5</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.52</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit, deg:</td><td>3.12</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>13.0697</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>4332.820 days</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>59.5 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Jupiter.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Jupiter.prototype.getCloudsMesh = function() { 
            return this.cloudsMesh;
        }

        Jupiter.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Jupiter);

    }
);
