define(
    [
        "Core/SceneObject", 
        "Plugins/VesmeerApp/Models/Sun",
        "Plugins/VesmeerApp/Models/Moon",
        "Plugins/VesmeerApp/Models/Earth",
        "Plugins/VesmeerApp/Models/Mars",
        "Plugins/VesmeerApp/Models/Venus",
        "Plugins/VesmeerApp/Models/Mercury",
        "Plugins/VesmeerApp/Models/Jupiter",
        "Plugins/VesmeerApp/Models/Saturn",
        "Plugins/VesmeerApp/Models/Uranus",
        "Plugins/VesmeerApp/Models/Neptune",
    ], 

    function(SceneObject, Sun, Moon, Earth, Mars, Venus, Mercury, Jupiter,
            Saturn, Uranus, Neptune) {
        
        /**
         * The Solar System scene object.
         */
        function SolarSystem(name) {
            SceneObject.call(this, name);

            this.label = 'Solar System';
            this.add(new Sun(this.name + '.Sun'));
            // this.add(new Moon(this.name + '.Moon'));
            this.add(new Earth(this.name + '.Earth'));
            this.add(new Mars(this.name + '.Mars'));
            this.add(new Venus(this.name + '.Venus'));
            this.add(new Mercury(this.name + '.Mercury'));
            this.add(new Jupiter(this.name + '.Jupiter'));
            this.add(new Saturn(this.name + '.Saturn'));
            this.add(new Uranus(this.name + '.Uranus'));
            this.add(new Neptune(this.name + '.Neptune'));
        }

        SolarSystem.prototype = Object.create(SceneObject.prototype);

        return (SolarSystem);
    }
);
