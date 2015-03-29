define(
    [
        "Core/SceneObject", "Plugins/VesmeerApp/Models/Moon",
        "Core/Unit", "Plugins/VesmeerApp/Shaders/EarthAtmosphereShader"
    ], 

    function(SceneObject, Moon, Unit, EarthAtmosphereShader) {

        /**
         * The Earth scene object.
         */
        function Earth(name) {
            SceneObject.call(this, name);

            this._setOrbitalElements();
            this._setDescription();
            
            this.label = 'Earth';
            this._rotationRateRadsPerSec = 7.292115e-5;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(Unit.dist(6378), 80, 80),
                new THREE.MeshPhongMaterial({
                    map: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/3_no_ice_clouds_2k.png'
                    ),
                    bumpMap: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/16_bit_dem_2k.jpg'
                    ),
                    bumpScale:   0.005,
                    // specularMap: THREE.ImageUtils.loadTexture('images/water_8k.png'),
                    // specular: new THREE.Color('gray'),
                    // map: THREE.ImageUtils.loadTexture('images/fair_clouds_8k.jpg'),
                    // transparent: true
                })
            );
            this.surfaceMesh.receiveShadow = true;
            this.surfaceMesh.castShadow = true;
            this.surfaceMesh.needsUpdate = true;
            this.setName(this.surfaceMesh, 'Surface');
            this.add(this.surfaceMesh);
            
            // this.cloudsMesh = new THREE.Mesh(
            //     new THREE.SphereGeometry(6380, 30, 30),
            //     new THREE.MeshPhongMaterial({
            //         map: THREE.ImageUtils.loadTexture(
            //             'Js/Lib/Plugins/VesmeerApp/Models/Textures/fair_clouds_4k.png'
            //         ),
            //         transparent: true
            //     })
            // );
            //this.add(new Moon(this.name + '.Moon'));

            this.atmosphereMesh = new THREE.Mesh(
                this.surfaceMesh.geometry.clone(),
                new THREE.ShaderMaterial({
                    uniforms: EarthAtmosphereShader.uniforms,
                    vertexShader: EarthAtmosphereShader.vertexShader,
                    fragmentShader: EarthAtmosphereShader.fragmentShader,
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

        Earth.prototype = Object.create(SceneObject.prototype);

        Earth.prototype._setOrbitalElements = function() {
            this.orbitalElements = {
                date: {year: 2014, month: 12, day: 28}, // date of ephemeris
                n: 0.9856173654392534, // daily motion [degrees]
                L: 96.181410069, // mean longitude [degrees] (M+w+W)
                e: 0.01668607452595415, // eccentricity
                a: 0.9999944545664107, // semi-major axis [AU]
                W: 175.4511850299205, // longitude of ascending node [degrees]
                w: 287.6289981825743, // argument of perifocus [degrees]
                i: 0.001886887952275544, // inclination [degrees]
            }
        }

        Earth.prototype.getOrbitalElements = function() {
            return this.orbitalElements;
        }

        Earth.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES (revised Sep 18, 2013): </span></td></tr>',
                    '<tr><td>  Mean radius, km:</td><td>6371.01+-0.01</td></tr>',
                    '<tr><td>  Mass, 10<sup>24</sup> kg:</td><td>5.97219+-0.0006</td></tr>',
                    '<tr><td>  Density, gm cm<sup>-3</sup>:</td><td>5.515</td></tr>',
                    '<tr><td>  Mean rot. rate, rad s<sup>-1</sup>:</td><td>7.292115*10<sup>-5</sup></td></tr>',
                    '<tr><td>  Sidereal period, hr:</td><td>23.93419</td></tr>',
                    '<tr><td>  Mean solar day, days:</td><td>1.002738</td></tr>',
                    '<tr><td>  Mean temperature, K:</td><td>270</td></tr>',
                    '<tr><td>  Atm. pressure:</td><td>1.0 bar</td></tr>',
                    '<tr><td>  Volume, 10<sup>10</sup> km<sup>3</sup>:</td><td>108.321</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.367 </td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to orbit, deg:</td><td>23.45</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>1.0000174 yrs</td></tr>',
                    '<tr><td>  Orbit velocity, km s<sup>-1</sup>:</td><td>29.7859</td></tr>',
                    '<tr><td>  Sidereal period:</td><td>365.25636 days</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>11.186 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Earth.prototype.getSurfaceMesh = function() { 
            return this.surfaceMesh;
        }

        Earth.prototype.getCloudsMesh = function() { 
            return this.cloudsMesh;
        }

        Earth.prototype.getMeshes = function() {
            return [this.surfaceMesh]
        }

        return (Earth);

    }
);
