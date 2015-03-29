define(
    [
        "Core/SceneObject",
        "Core/Unit",
        "Plugins/VesmeerApp/Shaders/SunSurfaceShader",
        "Plugins/VesmeerApp/Shaders/SunHaloShader",
        "Settings"
    ], 

    function(SceneObject, Unit, SunSurfaceShader, SunHaloShader, Settings) {

        /**
         * The Sun scene object.
         */
        function Sun(name) {
            SceneObject.call(this, name);

            this._setDescription();

            this.label = 'Sun';
            var sunRadius = Unit.dist(1391684 / 2);
            SunSurfaceShader.uniforms.radius = sunRadius;
            this.surfaceMesh = new THREE.Mesh(
                new THREE.SphereGeometry(sunRadius, 60, 60),
                new THREE.ShaderMaterial({
                    uniforms: SunSurfaceShader.uniforms,
                    vertexShader: SunSurfaceShader.vertexShader,
                    fragmentShader: SunSurfaceShader.fragmentShader,
                    //side: THREE.FrontSide,
                    //blending: THREE.AdditiveBlending,
                    //transparent: true
                })
            );
            this.setName(this.surfaceMesh, 'Surface');
            this.add(this.surfaceMesh);
            this.haloMesh = new THREE.Mesh(
                this.surfaceMesh.geometry.clone(),
                new THREE.ShaderMaterial({
                    uniforms: SunHaloShader.uniforms,
                    vertexShader: SunHaloShader.vertexShader,
                    fragmentShader: SunHaloShader.fragmentShader,
                    side: THREE.FrontSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true
                })
            );
            this.haloMesh.position = this.surfaceMesh.position;
            this.haloMesh.scale.multiplyScalar(1.3);
            this.setName(this.haloMesh, 'Halo');
            this.add(this.haloMesh);
            this.ambientLight = new THREE.AmbientLight(0x0C0C0C);
            this.setName(this.ambientLight, 'AmbientLight');
            this.add(this.ambientLight);
        }

        Sun.prototype = Object.create(SceneObject.prototype);
        

        Sun.prototype._setDescription = function() {
            this.description = [
                    '<table>',
                    '<tr><td colspan="2"><span class="section-title">PHYSICAL PROPERTIES: </span></td></tr>',
                    '<tr><td>  Radius (photosphere):</td><td>6.963(10<sup>5</sup>) km</td></tr>',
                    '<tr><td>  Mass, 10<sup>30</sup> kg:</td><td>1.988544</td></tr>',
                    '<tr><td>  Surface gravity:</td><td>274.0 m/s<sup>2</sup></td></tr>',
                    '<tr><td>  Mass-energy conv rate:</td><td>4.3(10<sup>12</sup> gm/s)</td></tr>',
                    '<tr><td>  Surf. temp (photosphr):</td><td>6600 K</td></tr>',
                    '<tr><td>  Volume, 10<sup>10</sup> km<sup>3</sup>:</td><td>6.085</td></tr>',
                    '<tr><td>  Geometric albedo:</td><td>0.106</td></tr>',
                    '<tr><td>&nbsp;</td></tr>',
                    '<tr><td colspan="2"><span class="section-title">DYNAMICAL CHARACTERISTICS:</span></td></tr>',
                    '<tr><td>  Obliquity to ecliptic:</td><td>7 deg 15\'</td></tr>',
                    '<tr><td>  Escape velocity:</td><td>617.7 km s<sup>-1</sup></tr>',
                    '</table>'
            ].join('\n');
        }

        Sun.prototype.getLights = function() {
            return this.lights;
        }

        Sun.prototype.getMeshes = function() {
            return [this.surfaceMesh];
        }

        /**
         * Adds the spot light to the sun and points it at the target object.
         *
         * @param fullName The full name of the light 
         *      (e.g. VesmeerApp.SolarSystem.Sun.Saturn.Light).
         * @param target The object to point the light at.
         * @param intensity The light intensity [1.0 is default].
         * @param shadowDarkness The shadow darkness level [0-1].
         */
        Sun.prototype.shineOn = function(rootSceneObject, fullName, target, 
                intensity, shadowDarkness) {
            //this.light = new THREE.PointLight(0xffffff, 0.9, 0);
            var light = new THREE.SpotLight(0xffffff, intensity, 0);
            //var light = new THREE.DirectionalLight(0xffffff, 1.0);
            //light = new THREE.PointLight(0xffffff, 0.9);
            light.name = fullName;
            var d = Unit.dist(20000);
            light.castShadow = true;
            light.shadowDarkness = shadowDarkness; // 0 - 1
            light.shadowCameraVisible = true;
            light.shadowMapWidth = light.shadowMapHeight = 4096;
            light.shadowCameraLeft = -d;
            light.shadowCameraRight = d;
            light.shadowCameraTop = d;
            light.shadowCameraBottom = -d;
            // Two params below are set in placeLightForSceneObject().
            // light.shadowCameraNear = Unit.dist(nearKm);
            // light.shadowCameraFar = Unit.dist(farKm);
            light.shadowCameraFov = 5;

            rootSceneObject.add(light);
        }

        Sun.prototype.placeLightForSceneObject = function(sceneObject, sunLight) {
            sunLight.position.copy(sceneObject.position.clone().multiplyScalar(0.998));
            sunLight.target = sceneObject;
            if (Settings.SHADOWS) {
                sunLight.shadowCameraNear = new THREE.Vector3().subVectors(
                    sceneObject.position,
                    sunLight.position
                ).length() * 0.9;
                    //sunLight.shadowCameraNear = 100;
                sunLight.shadowCameraFar = new THREE.Vector3().subVectors(
                    sceneObject.position,
                    sunLight.position
                ).length() * 1.1;
                    //sunLight.shadowCameraFar = 1000000;
                sunLight.shadowCamera.near = sunLight.shadowCameraNear;
                sunLight.shadowCamera.far = sunLight.shadowCameraFar;
                sunLight.shadowCamera.updateProjectionMatrix();
            }
        }

        return (Sun);
    }
);
