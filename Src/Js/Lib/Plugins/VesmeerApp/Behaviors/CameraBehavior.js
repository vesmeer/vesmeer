-   define(
    [
        "THREE", "Core/Behavior", "Core/Container", "Core/Time", 
        "Core/SceneObject", "Plugins/VesmeerApp/Settings",
        "Core/EventListenerRegistrar", "Core/Scene", "Utils/Utils",
        "TWEEN", "Core/Unit", "Utils/SoundUtils", "Core/CameraControls",
        "Plugins/VesmeerApp/Core/HUD"
    ], 

    function(THREE, Behavior, Container, Time, SceneObject, Settings, 
            EventListenerRegistrar, Scene, Utils, TWEEN, Unit, SoundUtils,
            CameraControls, HUD) {

        function CameraBehavior() {
            Behavior.call(this);

            var self = this;
            this._onKeyDown = function(event) {
                self.onKeyDown(event);
            }

            /* Set to true after the camera gets pointed to the selected
             * scene object once the scene loads. */
            this._cameraPointed = false;

            /* Current frame number. */
            this._frameNum = 0;

            /* Used for scaling acceleration as the user holds the translation
             * keyboard key. */
            this._accelerationFactor = { forward: 1, backward: 1 }
        }

        CameraBehavior.prototype = Object.create(Behavior.prototype);

        CameraBehavior.prototype.start = function() {
            Behavior.prototype.start.call(this);

            this._initObjects();
            this._eventListenerRegistrar.addListener(
                "keydown", 
                this._onKeyDown
            );
            this._scene.setSelectedObject(this._sun);
            this._earth = this._scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Earth');
            this._positionCameraNearSun();

            var self = this;
            var interval = setInterval(function() {
                if (self._scene.isLoaded()) {
                    self._hud.showMessage(
                        'Press the H key for help', 
                        10000,
                        HUD.MESSAGE_POSITION.CENTER
                    );
                    self._positionCameraNearEarth();
                    clearInterval(interval);
                }
            }, 4000);

            this._showForkMeOnGitHub();
        }

        CameraBehavior.prototype._showForkMeOnGitHub = function() {
            $("body").append('<div id="fork-me-github" class="hud-panel"></div>');
            var width = $("#fork-me-github").width();
            var posLeft = window.innerWidth / 2.0 - width / 2.0;
            $("#fork-me-github").css({
                "left": posLeft + "px",
            });
            $("#fork-me-github").stop();
            $("#fork-me-github").html(
                '<a href="https://github.com/vesmeer/vesmeer" target="_new">Fork me on GitHub</a>');
            $("#fork-me-github").show(0);
        }

        CameraBehavior.prototype._initObjects = function() {
            this._scene = Container.get('scene');
            this._camera = Container.get('camera');
            this._cameraControls = new CameraControls(
                this._camera,
                this._scene.findObjectByName(Settings.ROOT_SCENE_OBJECT_NAME)
            );
            this._eventListenerRegistrar = Container.get(
                'event-listener-registrar');
            this._sun = this._scene.findObjectByName(
                'VesmeerApp.StarDome.SolarSystem.Sun');
            this._hud = Container.get('hud');
        }


        CameraBehavior.prototype._resetAccelerationFactor = function() {
            this._accelerationFactor.forward = 1;
            this._accelerationFactor.backward = 1;
        }

        CameraBehavior.prototype._positionCameraNearSun = function() {
            this._camera.up = new THREE.Vector3(0, 1, 0);

            // This initial position of the camera has to be set to non-zero
            // value because otherwise determining the camera looking 
            // direction vector returns NaN instead of numbers.
            this._camera.position.set(
                Unit.dist(0), 
                Unit.dist(0),
                Unit.dist(1)
            );
            // Near Sun.
            this._cameraControls.setPosition(
                new THREE.Vector3(
                    Unit.dist(0),
                    Unit.dist(0),
                    Unit.dist(1500000 * 3)
                )
            );
        }

        CameraBehavior.prototype._positionCameraNearEarth = function() {
            var self = this;
            setTimeout(function() {
                self._scene.setSelectedObject(self._earth);
                self._cameraControls.goToObject(
                    self._scene.getSelectedObject(),
                    null
                );
            }, 2000);
        }

        CameraBehavior.prototype.onKeyDown = function(event) {
            switch (event.keyCode) {
                case EventListenerRegistrar.KEY['o']:
                    this._handleFollowObjectEvent();
                    break;
                case EventListenerRegistrar.KEY['l']:
                    this._handleLookAtObjectEvent();
                    break;
                case EventListenerRegistrar.KEY['g']:
                    this._handleGoToObjectEvent();
                    break;
                case EventListenerRegistrar.KEY['x']:
                    this._handleToggleAxisHelperEvent();
                    break;
                case EventListenerRegistrar.KEY['q']:
                    this._handleToggleDollyDirectionEvent();
                    break;
                case EventListenerRegistrar.KEY['t']:
                    this._handleTrackObjectEvent();
                    break;
                case EventListenerRegistrar.KEY['e']:
                    this._handleToggleEquatorialPlaneEvent();
                    break;
                case EventListenerRegistrar.KEY['i']:
                    this._handleToggleObjectInfoPanelEvent();
                    break;
                case EventListenerRegistrar.KEY['h']:
                    this._handleToggleHelpPanelEvent();
                    break;
            }
        }

        CameraBehavior.prototype._handleFollowObjectEvent = function() {
            if (this._scene.getSelectedObject() == null) return;

            SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
            //THREE.SceneUtils.attach(this._camera, this._scene, this._scene.getSelectedObject());
            if (this._cameraControls.getStatus().FollowingObject === false) {
                this._cameraControls.followObject(this._scene.getSelectedObject());
            }
            else {
                this._cameraControls.followObject(null);
            }
            this._setHUDFollowObjectCell();
        }

        CameraBehavior.prototype._setHUDFollowObjectCell = function() {
            if (this._cameraControls.getStatus().FollowingObject === true) {
                this._hud.setData(
                    'follow', 
                    this._cameraControls.getFollowedObject().label
                );
            }
            else {
                this._hud.deleteData('follow');
            }
        }

        CameraBehavior.prototype._handleLookAtObjectEvent = function() {
            SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
            if (this._scene.getSelectedObject() !== null) {
                var selectedObjectPos = SceneObject.localToWorld(
                    this._scene.getSelectedObject());
                this._cameraControls.lookAt(
                    selectedObjectPos, 
                    700, 
                    function() {}
                );
            }
        }

        CameraBehavior.prototype._handleGoToObjectEvent = function() {
            SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
            this._hud.showMessage(
                'Going to ' + this._scene.getSelectedObject().label, 
                1000,
                HUD.MESSAGE_POSITION.BOTTOM,
                {width: 100, height: 20}
            );
            var self = this;
            if (this._scene.getSelectedObject() !== null) {
                this._cameraControls.followObject(
                    this._scene.getSelectedObject());
                this._setHUDFollowObjectCell();
                this._cameraControls.setTranslationSpeed(0); // Stops camera dolly motion (back or forth).
                this._resetAccelerationFactor();
                this._cameraControls.goToObject(
                    this._scene.getSelectedObject(),
                    function() { 
                        SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
                        self._hud.hideObjectDescription();
                        self._hud.showObjectDescription(
                            self._scene.getSelectedObject().getDescription(), 
                            5000
                        );
                    }
                );
            }
        }

        CameraBehavior.prototype._handleToggleAxisHelperEvent = function() {
            var selectedObject = this._scene.getSelectedObject();
            if (selectedObject !== null) {
                if (selectedObject.isAxisHelperActive() === false) {
                    SoundUtils.playSound(SoundUtils.SOUNDS.Tick);
                    this._hud.showMessage(
                        selectedObject.label + ' axes on', 
                        1000,
                        HUD.MESSAGE_POSITION.BOTTOM,
                        {width: 100, height: 20}
                    );
                }
                else {
                    this._hud.showMessage(
                        selectedObject.label + ' axes off', 
                        1000,
                        HUD.MESSAGE_POSITION.BOTTOM,
                        {width: 100, height: 20}
                    );
                }
                selectedObject.toggleAxisHelper();
            }
        }

        CameraBehavior.prototype._handleToggleObjectInfoPanelEvent = function() {
            if (this._hud.isObjectDescriptionShowing()) {
                this._hud.hideObjectDescription();
            }
            else {
                if (this._scene.getSelectedObject()) {
                    SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
                    this._hud.showObjectDescription(
                        this._scene.getSelectedObject().getDescription(), 
                        10e10
                    );
                }
            }
        }

        CameraBehavior.prototype._handleToggleHelpPanelEvent = function() {
            if (!this._hud.isHelpShowing()) 
                SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
            
            this._hud.toggleHelp();
        }

        CameraBehavior.prototype._handleToggleEquatorialPlaneEvent = function() {
            var selectedObject = this._scene.getSelectedObject();
            if (selectedObject == null) return;
            if (!selectedObject.isEquatorialPlaneOn()) {
                SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
                this._hud.showMessage(
                    selectedObject.label + ' equatorial plane on', 
                    2000,
                    HUD.MESSAGE_POSITION.BOTTOM,
                    {width: 150, height: 20}
                );
            }
            else {
                this._hud.showMessage(
                    selectedObject.label + ' equatorial plane off', 
                    2000,
                    HUD.MESSAGE_POSITION.BOTTOM,
                    {width: 150, height: 20}
                );
            }
            selectedObject.toggleEquatorialPlane();
        }

        CameraBehavior.prototype._handleToggleDollyDirectionEvent = function() {
            SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
            this._hud.showMessage(
                'Reversing direction', 
                1000,
                HUD.MESSAGE_POSITION.BOTTOM,
                {width: 150, height: 20}
            );
            this._cameraControls.toggleDollyDirection();
        }

        CameraBehavior.prototype._handleTrackObjectEvent = function() {
            if (this._scene.getSelectedObject() == null) return;

            SoundUtils.playSound(SoundUtils.SOUNDS.LockIn);
            if (this._cameraControls.getStatus().TrackingObject === false) {
                this._cameraControls.trackObject(this._scene.getSelectedObject());
            }
            else {
                this._cameraControls.trackObject(null);
            }
            this._setHUDTrackObjectCell();
        }

        CameraBehavior.prototype._setHUDTrackObjectCell = function() {
            if (this._cameraControls.getStatus().TrackingObject) {
                this._hud.setData(
                    'track', 
                    this._scene.getSelectedObject().label
                );
            }
            else {
                this._hud.deleteData('track');
            }
        }

        CameraBehavior.prototype.update = function() {
            Behavior.prototype.update.call(this);

            this._frameNum += 1;
            this._lookAtSelectedObjectAfterLoad();
            this._handleControls();
            this._cameraControls.update();
        }

        /**
         * Looks at the selected object after the scene loads.
         */
        CameraBehavior.prototype._lookAtSelectedObjectAfterLoad = function() {
            if (this._cameraPointed == false && Time.elapsedTime > 1 && 
                    this._scene.getSelectedObject() != null) {
                this._cameraControls.lookAt(
                    this._scene.getSelectedObject().position, 
                    700, 
                    function() {}
                );
                this._cameraPointed = true;
            }
        }

        /**
         * Moves the camera using the 'a' and 'z' keys to go back and forth,
         * and the arrow keys to point the camera.
         */
        CameraBehavior.prototype._handleControls = function() {
            var keyboard = Container.get('keyboard');

            this._handleRotationCCW(keyboard);
            this._handleRotationCW(keyboard);
            this._handleRotationDown(keyboard);
            this._handleRotationUp(keyboard);
            this._handleTranslateForward(keyboard);
            this._handleTranslateBackward(keyboard);
            this._handleStopTranslation(keyboard);
            this._handleOrbit(keyboard);
        }

        /**
         * Rotates the camera counter-clockwise around the y-axis.
         */
        CameraBehavior.prototype._handleRotationCCW = function(keyboard) {
            if (keyboard.pressed('left') && !keyboard.pressed('ctrl+left')) {
                this._cameraControls.rotateZ(Settings.CAMERA_ROTATION_RATE);
            }   
        }

        /**
         * Rotates the camera clockwise on the y-axis.
         */
        CameraBehavior.prototype._handleRotationCW = function(keyboard) {
            if (keyboard.pressed('right') && !keyboard.pressed('ctrl+right')) {
                this._cameraControls.rotateZ(-Settings.CAMERA_ROTATION_RATE);
            }
        }

        /**
         * Rotates the camera down on the x-axis.
         */
        CameraBehavior.prototype._handleRotationDown = function(keyboard) {
            if (keyboard.pressed('down') && !keyboard.pressed('ctrl+down')) {
                this._cameraControls.rotateX(Settings.CAMERA_ROTATION_RATE);
            }
        }

        /**
         * Rotates the camera up on the x-axis.
         */
        CameraBehavior.prototype._handleRotationUp = function(keyboard) {
            if (keyboard.pressed('up') && !keyboard.pressed('ctrl+up')) {
                this._cameraControls.rotateX(-Settings.CAMERA_ROTATION_RATE);
            }
        }

        /**
         * Moves the camera forward.
         */
        CameraBehavior.prototype._handleTranslateForward = function(keyboard) {
            if (keyboard.pressed('a')) {
                this._computeTranslationForwardSpeed();
                // See this._cameraControls.dolly() for the actual translation procedure.
            }
        }

        CameraBehavior.prototype._computeTranslationForwardSpeed = function() {
            this._accelerationFactor.backward = 1;
            this._accelerationFactor.forward += 1;
            this._cameraControls.increaseTranslationSpeed(
                Unit.dist(Settings.CAMERA_ACCELERATION) * 
                    Math.pow(this._accelerationFactor.forward, 2) / 4
            );
        }

        /**
         * Moves the camera backward.
         */
        CameraBehavior.prototype._handleTranslateBackward = function(keyboard) {
            if (keyboard.pressed('z')) {
                this._computeTranslationBackwardSpeed();
                if (this._cameraControls.getTranslationSpeed() < 0) 
                    this._cameraControls.setTranslationSpeed(0);
                // See this._cameraControls.dolly() for the actual translation procedure.
            }
        }

        CameraBehavior.prototype._computeTranslationBackwardSpeed = function() {
            this._accelerationFactor.backward += 1;
            this._accelerationFactor.forward = 1;
            this._cameraControls.increaseTranslationSpeed(
                -Unit.dist(Settings.CAMERA_ACCELERATION) *
                    Math.pow(this._accelerationFactor.backward, 2) / 4
            );
        }

        /**
         * Stops the camera if it's moving.
         */
        CameraBehavior.prototype._handleStopTranslation = function(keyboard) {
            if (keyboard.pressed('s')) {
                this._accelerationFactor.backward = 0;
                this._accelerationFactor.forward = 0;
                this._cameraControls.setTranslationSpeed(0);
            }
        }

        /**
         * Orbits the selected object clockwise or counter-clockwise with
         * the camera always pointing at the object.
         */
        CameraBehavior.prototype._handleOrbit = function(keyboard) {
            if (this._scene.getSelectedObject() != null && (
                    keyboard.pressed('ctrl+left') || 
                    keyboard.pressed('ctrl+right'))) {
                var orbitSpeed = -90;
                
                if (keyboard.pressed('ctrl+left')) {
                    this._cameraControls.orbitObject(
                        this._scene.getSelectedObject(),
                        orbitSpeed
                    );    
                }
                else if (keyboard.pressed('ctrl+right')) {
                    this._cameraControls.orbitObject(
                        this._scene.getSelectedObject(),
                        -orbitSpeed
                    );
                }
            }
        }

        return (CameraBehavior);
    }
);
