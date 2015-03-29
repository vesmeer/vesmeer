define(
    [
        "THREE", "Core/Plugin", "Core/SceneObject",
        "Core/Container", 
        "Plugins/VesmeerApp/Settings",
        "Plugins/VesmeerApp/Models/StarDome",
        "Plugins/VesmeerApp/Core/HUD",
        "text!Plugins/VesmeerApp/Templates/HudLayout.html",
        "Core/Unit"
    ],

    function(THREE, Plugin, SceneObject, Container, Settings, 
        StarDome, HUD, HUDLayoutHtml, Unit) {

        function VesmeerAppPlugin() {
            this.name = 'VesmeerApp';
        }

        VesmeerAppPlugin.prototype = new Plugin();

        VesmeerAppPlugin.prototype.load = function(engine) {
            Plugin.prototype.load.call(this, engine);

            this.engine.setCamera(
                new THREE.PerspectiveCamera(
                    Settings.DEFAULT_CAMERA_FOV, 
                    window.innerWidth / window.innerHeight, 
                    Settings.DEFAULT_RENDERING_NEAR_PLANE * 
                        Unit.getLengthScalingFactor(), 
                    Settings.DEFAULT_RENDERING_FAR_PLANE *
                        Unit.getLengthScalingFactor()
                )
            );
            this.engine.getCamera().name = 'main-camera';
            Container.set('camera', this.engine.getCamera());

            var hud = new HUD();
            hud.setCellsLayout(HUDLayoutHtml);
            Container.set('hud', hud);

            this.engine.getScene().add(new StarDome(this.name + '.StarDome'));
            this.assignBehaviorsToSceneObjects();
        }

        VesmeerAppPlugin.prototype.update = function() {

        }

        return (VesmeerAppPlugin);
    }
);
