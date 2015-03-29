define(
	[
		"Plugins/VesmeerApp/Behaviors/SolarSystemBehavior",
		"Plugins/VesmeerApp/Behaviors/CameraBehavior",
		"Plugins/VesmeerApp/Behaviors/SunBehavior",
        "Plugins/VesmeerApp/Behaviors/EarthBehavior",
        "Plugins/VesmeerApp/Behaviors/MarsBehavior",
        "Plugins/VesmeerApp/Behaviors/VenusBehavior",
        "Plugins/VesmeerApp/Behaviors/JupiterBehavior",
        "Plugins/VesmeerApp/Behaviors/SaturnBehavior",
        "Plugins/VesmeerApp/Behaviors/UranusBehavior",
        "Plugins/VesmeerApp/Behaviors/NeptuneBehavior",
        "Plugins/VesmeerApp/Behaviors/HUDBehavior",
        "Plugins/VesmeerApp/Behaviors/StarDomeBehavior",
		"Plugins/VesmeerApp/Behaviors/MercuryBehavior"
	],

	/**
	 * Maps behaviors to scene objects.
	 */
	function(SolarSystemBehavior, CameraBehavior, SunBehavior, EarthBehavior, 
        MarsBehavior, VenusBehavior, JupiterBehavior, SaturnBehavior, 
        UranusBehavior, NeptuneBehavior, HUDBehavior, StarDomeBehavior,
        MercuryBehavior) {

		var behaviorToSceneObjectsMap = {
            'VesmeerApp.StarDome': [
                new StarDomeBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem': [
                new SolarSystemBehavior(), 
                new CameraBehavior(),
                new HUDBehavior(),
            ],
            'VesmeerApp.StarDome.SolarSystem.Sun': [
                new SunBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Mercury': [
                new MercuryBehavior()
            ],
			'VesmeerApp.StarDome.SolarSystem.Earth': [
                new EarthBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Mars': [
                new MarsBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Venus': [
                new VenusBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Jupiter': [
                new JupiterBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Saturn': [
                new SaturnBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Uranus': [
                new UranusBehavior()
            ],
            'VesmeerApp.StarDome.SolarSystem.Neptune': [
                new NeptuneBehavior()
            ],
		}

		return (behaviorToSceneObjectsMap);
	}
);
