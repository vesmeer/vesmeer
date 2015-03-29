define(
    [
        "Core/Behavior", "Core/EventListenerRegistrar", "Core/Container",
        "Plugins/VesmeerApp/Core/HUD"
    ],
    function(Behavior, EventListenerRegistrar, Container, HUD) {

        function StarDomeBehavior() {
            Behavior.call(this);

            var self = this;
            this._onKeyDown = function(event) {
                self.onKeyDown(event);
            }
        }

        StarDomeBehavior.prototype = Object.create(Behavior.prototype);

        StarDomeBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this.scene = Container.get('scene');
            this.starDome = this.scene.findObjectByName(
                'VesmeerApp.StarDome');
            this.eventListenerRegistrar = Container.get(
                'event-listener-registrar');

            this.eventListenerRegistrar.addListener(
                "keydown", 
                this._onKeyDown
            );
            this.starDome.setBrightness(1.0);
            this.hud = Container.get('hud');
        }

        StarDomeBehavior.prototype.onKeyDown = function(event) {
            switch (event.keyCode) {
                case EventListenerRegistrar.KEY['[']:
                    this.decreaseStarDomeBrightness();
                    break;
                case EventListenerRegistrar.KEY[']']:
                    this.increaseStarDomeBrightness();
                    break;  
            } 
        }

        StarDomeBehavior.prototype.decreaseStarDomeBrightness = function() {
            this.starDome.setBrightness(
                Math.max(this.starDome.getBrightness() - 0.01 , 0));
            this.hud.showMessage(
                'Star field brightness: ' + 
                    (this.starDome.getBrightness() * 100).toFixed(0) + '%', 
                1000,
                HUD.MESSAGE_POSITION.BOTTOM,
                {width: 240, height: 20}
            );
        }

        StarDomeBehavior.prototype.increaseStarDomeBrightness = function() {
            this.starDome.setBrightness(
                Math.min(this.starDome.getBrightness() + 0.01 , 1.0));
            this.hud.showMessage(
                'Star field brightness: ' + 
                    (this.starDome.getBrightness() * 100).toFixed(0) + '%', 
                1000,
                HUD.MESSAGE_POSITION.BOTTOM,
                {width: 240, height: 20}
            );
        }

        StarDomeBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);
        }

        return (StarDomeBehavior);
    }

);
