define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings",
        "Plugins/VesmeerApp/Core/Ephemeris"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, 
            Ephemeris) {

        function SolarSystemBehavior() {
            Behavior.call(this);

            this.frameNum = 0;
        }

        SolarSystemBehavior.prototype = Object.create(Behavior.prototype);

        SolarSystemBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            
            this.objectPhysics = Container.get('object-physics');
            this.objectPhysics.setRootSceneObject(
                this.scene.findObjectByName(Settings.ROOT_SCENE_OBJECT_NAME)
            );
            this.rootSceneObject = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME);

            this.sun = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun');
            this.mars = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Mars');
            this.earth = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Earth');
            this.venus = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Venus');
            this.mercury = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Mercury');
            this.jupiter = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Jupiter');
            this.saturn = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Saturn');
            this.uranus = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Uranus');
            this.neptune = this.scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Neptune');

            this.sun.shineOn(
                this.rootSceneObject,
                this.ROOT_SCENE_OBJECT_NAME + '.MercuryLight',
                this.mercury, 
                0.9,
                0.5
            );
            this.mercurySunLight = this.scene.findObjectByName(
                this.ROOT_SCENE_OBJECT_NAME + '.MercuryLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.SaturnLight',
                this.saturn, 
                0.7,
                0.5
            );
            this.saturnSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.SaturnLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.EarthLight',
                this.earth, 
                0.9,
                0.5
            );
            this.earthSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.EarthLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.VenusLight',
                this.venus, 
                0.8,
                0.5
            );
            this.venusSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.VenusLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.MarsLight',
                this.mars, 
                0.9,
                0.5
            );
            this.marsSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.MarsLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.JupiterLight',
                this.jupiter, 
                0.9,
                0.5
            );
            this.jupiterSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.JupiterLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.UranusLight',
                this.uranus, 
                0.8,
                0.5
            );
            this.uranusSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.UranusLight');

            this.sun.shineOn(
                this.rootSceneObject,
                Settings.ROOT_SCENE_OBJECT_NAME + '.NeptuneLight',
                this.neptune, 
                0.6,
                0.5
            );
            this.neptuneSunLight = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME + '.NeptuneLight');
        }

        SolarSystemBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this.frameNum += 1;

            this.setSceneObjectPositions();
        }

        SolarSystemBehavior.prototype.setSceneObjectPositions = function() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1
            var day = date.getDate();
            
            this.mars.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.mars.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.earth.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.earth.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.mercury.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.mercury.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.venus.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.venus.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.jupiter.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.jupiter.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.saturn.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.saturn.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.uranus.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.uranus.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );
            this.neptune.position.copy(
                Ephemeris.getHelicentricPosition(
                    this.neptune.getOrbitalElements(),
                    {
                        year: year, 
                        month: month, 
                        day: day
                    }
                )
            );

            if (this.frameNum % 30 == 0) {
                this.sun.placeLightForSceneObject(
                    this.saturn, this.saturnSunLight);
                this.sun.placeLightForSceneObject(
                    this.earth, this.earthSunLight);
                this.sun.placeLightForSceneObject(
                    this.mercury, this.mercurySunLight);
                this.sun.placeLightForSceneObject(
                    this.venus, this.venusSunLight);
                this.sun.placeLightForSceneObject(
                    this.mars, this.marsSunLight);
                this.sun.placeLightForSceneObject(
                    this.jupiter, this.jupiterSunLight);
                this.sun.placeLightForSceneObject(
                    this.uranus, this.uranusSunLight);
                this.sun.placeLightForSceneObject(
                    this.neptune, this.neptuneSunLight);
            }
        }

        return (SolarSystemBehavior);
    }
);
