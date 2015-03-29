define(
	[
		"Plugins/VesmeerApp/Settings"
	],
	function(Settings) {

		Unit.UNIT_KM = 'km';

		Unit.UNIT_LS = 'ls'; // lightsecond

		Unit.UNIT_AU = 'AU';

		Unit.UNIT_LY = 'ly';

		/* Speed of light in km/s. */
		Unit.c = 299792.458;

		/* Lightsecond distance in km. */
		Unit.ls = Unit.c;

		/* Distance from Earth to the sun in km. */
		Unit.AU = 149600000.0;

		/* Light year in km. */
		Unit.ly = 9.4605284e12;

		function Unit() {}

		/**
		 * Scales the length/distance unit to values actually used by to
		 * render the scene. This is done because using too large or too
		 * small length units can introduce undesired artifacts when the
		 * scene is built.
		 */
		Unit.dist = function(value) {
			return value * Settings.LENGTH_SCALING_FACTOR;
		}

		Unit.getLengthScalingFactor = function() {
			return Settings.LENGTH_SCALING_FACTOR;
		}

		/**
		 * Returns the value scaled back to the units used to communicate
		 * distance (km).
		 */
		Unit.rawToKm = function(value) {
			return value / Settings.LENGTH_SCALING_FACTOR;
		}

		Unit.convertKmTo = function(value, unit) {
			if (value == 0) return value;

			switch (unit) {
				case Unit.UNIT_KM: 
					return value;
				case Unit.UNIT_LS:
					return value / Unit.ls;
				case Unit.UNIT_AU:
					return value / Unit.AU
				case Unit.UNIT_LY:
					return value / Unit.ly;
			}
		}

		Unit.convertAUTo = function(value, unit) {
			switch (unit) {
				case Unit.UNIT_KM:
					return Unit.AU * value;
			}
		}

		return (Unit);
	}
);
