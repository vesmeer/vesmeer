"use strict";

define(
    ['THREE', 'Plugins/VesmeerApp/Behaviors/CameraBehavior', 'Core/Container',
     'Core/Scene', 'Core/EventListenerRegistrar', 'Core/SceneObject', 
     'Plugins/VesmeerApp/Settings', 'Plugins/VesmeerApp/Core/HUD', 'Utils/Utils',
     'Plugins/VesmeerApp/Models/Sun', 'Core/Time', 'Vendor/THREEx.KeyboardState'],
    function(THREE, CameraBehavior, Container, Scene, EventListenerRegistrar,
        SceneObject, Settings, HUD, Utils, Sun, Time, KeyboardState) {

        var run = function() {
            module("CameraBehavior", {
                setup: function(assert) {
                    this.b = new CameraBehavior();
                    Settings.ROOT_SCENE_OBJECT_NAME = 'rootsceneobject';
                    var scene = new Scene();
                    scene.add(new SceneObject('rootsceneobject'));
                    scene.add(new Sun('VesmeerApp.StarDome.SolarSystem.Sun'));
                    Container.set('scene', scene);
                    Container.set('camera', new THREE.PerspectiveCamera(
                        80, 
                        window.innerWidth / window.innerHeight, 
                        0.1, 
                        1000
                    ));
                    Container.set('hud', new HUD());
                    Container.set('event-listener-registrar', 
                        new EventListenerRegistrar());
                }, 
                teardown: function() {

                }
            });
            test('start() should initiate the object', function(assert) {
                this.b.start();

                assert.ok(this.b._scene);
                assert.ok(this.b._camera);
                assert.ok(this.b._cameraControls);
                assert.ok(this.b._eventListenerRegistrar);
                assert.ok(this.b._hud);
                assert.ok(this.b._sun);
            });
            test('start() should position the camera near the Sun', function(assert) {
                this.b.start();

                var rootSceneObj = this.b._scene.findObjectByName(Settings.ROOT_SCENE_OBJECT_NAME);
                assert.ok(Utils.vectorsDiffLessThan(
                    rootSceneObj.position,
                    new THREE.Vector3(0, 0, -1500000 * 3),
                    1
                ));
            });
            test('onKeyDown() should start object following when "o" is pressed', function(assert) {
                this.b.start();

                var called = false;
                // patching
                this.b._cameraControls.getStatus().FollowingObject = false;
                this.b._cameraControls.followObject = function(obj) {
                    if (obj !== undefined) called = true;
                }
                this.b._cameraControls._followedObject = {}
                this.b._cameraControls._followedObject.label = "Sun";
                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['o'];
                this.b.onKeyDown(e);

                assert.ok(called);
                assert.equal(this.b._hud.data['follow'], "Sun"); 
            });
            test('onKeyDown() should not follow object when "o" is pressed and no object is selected', function(assert) {
                this.b.start();

                var called = false;
                // patching
                this.b._cameraControls.getStatus().FollowingObject = false;
                this.b._scene.getSelectedObject = function() {
                    return null;
                }
                this.b._cameraControls.followObject = function(obj) {
                    called = true;
                }
                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['o'];
                this.b.onKeyDown(e);

                assert.ok(called == false);
            });
            test('onKeyDown() should unfollow object when "o" is pressed and object is followed', function(assert) {
                this.b.start();
                var called = false;
                // patching
                this.b._cameraControls._followedObject = this.b._scene.getSelectedObject();
                this.b._cameraControls.followObject = function(obj) {
                    if (obj == null) called = true;
                    this._followedObject = null;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['o'];
                this.b.onKeyDown(e);

                assert.ok(called);
                assert.equal(this.b._hud.data['follow'], undefined); 
            });
            test('onKeyDown() should start moving the camera towards object when "g" is pressed', function(assert) {
                this.b.start();
                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['g'];
                this.b.onKeyDown(e);

                assert.ok(this.b._cameraControls._followedObject);
                assert.equal(this.b._hud.data['follow'], "Sun"); 
                assert.equal(this.b._cameraControls.getTranslationSpeed(), 0);
                assert.equal(this.b._accelerationFactor.forward, 1);
                assert.equal(this.b._accelerationFactor.backward, 1);
            });
            test('onKeyDown() should toggle the object axis when "x" is pressed', function(assert) {
                this.b.start();
                // patching
                var called = false;
                this.b._scene.getSelectedObject().toggleAxisHelper = function() {
                    called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['x'];
                this.b.onKeyDown(e);

                assert.ok(called);

            });
            test('onKeyDown() should do nothing when "x" is pressed and no object is selected', function(assert) {
                this.b.start();
                // patching
                var called = false;
                this.b._scene.getSelectedObject().toggleAxisHelper = function() {
                    called = true;
                }
                this.b._scene.getSelectedObject = function() {
                    return null;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['x'];
                this.b.onKeyDown(e);

                assert.ok(called == false);

            });
            test('onKeyDown() should toggle on object descriptions when "i" is first pressed', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._hud.showObjectDescription = function(obj) {
                    if (obj !== null) called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['i'];
                this.b.onKeyDown(e);

                assert.ok(called);
            });
            test('onKeyDown() should toggle off object description when "i" is pressed again', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._hud.isObjectDescriptionShowing = function() {
                    return true;
                }
                this.b._hud.hideObjectDescription = function(obj) {
                    if (obj !== null) called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['i'];
                this.b.onKeyDown(e);

                assert.ok(called);                
            });
            test('onKeyDown() should do nothing when "i" is pressed and no object is selected', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._scene.getSelectedObject = function() {
                    return null;
                }
                this.b._hud.showObjectDescription = function(obj) {
                    if (obj !== null) called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['i'];
                this.b.onKeyDown(e);

                assert.ok(called == false);
            });
            test('onKeyDown() should toggle help when "i" is pressed', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._hud.toggleHelp = function() {
                    called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['h'];
                this.b.onKeyDown(e);

                assert.ok(called); 
            });
            test('onKeyDown() should toggle the equatorial plane when "e" is pressed', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._scene._selectedSceneObject.toggleEquatorialPlane = function() {
                    called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['e'];
                this.b.onKeyDown(e);

                assert.ok(called); 
            });
            test('onKeyDown() should do nothing when "e" is pressed and no object is selected', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._scene.getSelectedObject = function() {
                    return null;
                }
                this.b._scene._selectedSceneObject.toggleEquatorialPlane = function() {
                    called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['e'];
                this.b.onKeyDown(e);

                assert.ok(called == false);
            });
            test('onKeyDown() should toggle dollying direction when "q" is pressed', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._cameraControls.toggleDollyDirection = function() {
                    called = true;
                }

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['q'];
                this.b.onKeyDown(e);

                assert.ok(called);
            })
            test('onKeyDown() should start tracking object when "t" is pressed', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._cameraControls.getStatus().TrackingObject = false;
                this.b._cameraControls.trackObject = function(obj) {
                    if (obj !== undefined) called = true;
                }
                this.b._cameraControls._trackedObject = {}
                this.b._cameraControls._trackedObject.label = "Sun";

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['t'];
                this.b.onKeyDown(e);

                assert.ok(called);
                assert.equal(this.b._hud.data['track'], "Sun");
            });
            test('onKeyDown() should stop tracking object when "t" is pressed again', function(assert) {
                this.b.start();
                // Patching
                var called = false;
                this.b._cameraControls.getStatus().TrackingObject = true;
                this.b._cameraControls.trackObject = function(obj) {
                    if (obj == null) called = true;
                    this._trackedObject = null
                }
                this.b._cameraControls._trackedObject = this.b._scene.getSelectedObject();

                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['t'];
                this.b.onKeyDown(e);

                assert.ok(called);
                assert.equal(this.b._hud.data['track'], undefined);
            });
            test('onKeyDown() should not track object when "o" is pressed and no object is selected', function(assert) {
                this.b.start();

                var called = false;
                // Patching
                this.b._cameraControls.getStatus().FollowingObject = false;
                this.b._scene.getSelectedObject = function() {
                    return null;
                }
                this.b._cameraControls.trackObject = function(obj) {
                    called = true;
                }
                var e = jQuery.Event("keydown");
                e.keyCode = EventListenerRegistrar.KEY['o'];
                this.b.onKeyDown(e);

                assert.ok(called == false);
            });
            test('_handleControls() should rotate left if left arrow pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'left' && key != 'ctrl+left') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.rotateZ = function() {
                    called = true;
                }

                this.b._handleControls();

                assert.ok(called); 
            });
            test('_handleControls() should rotate right if right arrow pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'right' && key != 'ctrl+right') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.rotateZ = function() {
                    called = true;
                }

                this.b._handleControls();

                assert.ok(called); 
            });
            test('_handleControls() should rotate down if down arrow pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'down' && key != 'ctrl+down') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.rotateX = function() {
                    called = true;
                }

                this.b._handleControls();

                assert.ok(called); 
            });
            test('_handleControls() should rotate up if up arrow pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'up' && key != 'ctrl+up') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.rotateX = function() {
                    called = true;
                }

                this.b._handleControls();

                assert.ok(called); 
            });
            test('_handleControls() should translate forward if "a" key pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'a') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var accelerationFactorForward = this.b._accelerationFactor.forward;
                var called = false;
                this.b._cameraControls.increaseTranslationSpeed = function(speed) {
                    if (isNaN(speed) == false && speed > 0) called = true;
                }

                this.b._handleControls();

                assert.equal(this.b._accelerationFactor.backward, 1);
                assert.equal(this.b._accelerationFactor.forward, 
                    accelerationFactorForward + 1);
                assert.ok(called);
            });
            test('_handleControls() should translate backward if "z" key pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'z') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var accelerationFactorBackward = this.b._accelerationFactor.backward;
                var called = false;
                this.b._cameraControls.increaseTranslationSpeed = function(speed) {
                    if (isNaN(speed) == false && speed < 0) called = true;
                }

                this.b._handleControls();

                assert.equal(this.b._accelerationFactor.forward, 1);
                assert.equal(this.b._accelerationFactor.backward, 
                    accelerationFactorBackward + 1);
                assert.ok(called);
            });
            test('_handleControls() should stop translation if "s" key pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 's') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.setTranslationSpeed = function(speed) {
                    if (isNaN(speed) == false && speed == 0) called = true;
                }

                this.b._handleControls();

                assert.equal(this.b._accelerationFactor.backward, 0);
                assert.equal(this.b._accelerationFactor.forward, 0);
                assert.ok(called);
            });
            test('_handleControls() should orbit counterclockwise if "ctrl+left" keys pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'ctrl+left') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.orbitObject = function(obj, speed) {
                    if (obj !== undefined && isNaN(speed) == false) called = true;
                }

                this.b._handleControls();

                assert.ok(called);
            });
            test('_handleControls() should do nothing if "ctrl+left" keys pressed and no object is selected', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'ctrl+left') return true;
                    return false;
                }
                this.b._scene.getSelectedObject = function() {
                    return null;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.orbitObject = function(obj, speed) {
                    if (obj !== undefined && isNaN(speed) == false) called = true;
                }

                this.b._handleControls();

                assert.ok(called == false);
            });
            test('_handleControls() should orbit clockwise if "ctrl+right" keys pressed', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'ctrl+right') return true;
                    return false;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.orbitObject = function(obj, speed) {
                    if (obj !== undefined && isNaN(speed) == false) called = true;
                }

                this.b._handleControls();

                assert.ok(called);
            });
            test('_handleControls() should do nothing if "ctrl+right" keys pressed and no object is selected', function(assert) {
                this.b.start();
                this.keyboard = new KeyboardState();
                // Patching
                this.keyboard.pressed = function(key) {
                    if (key == 'ctrl+right') return true;
                    return false;
                }
                this.b._scene.getSelectedObject = function() {
                    return null;
                }
                Container.set('keyboard', this.keyboard);
                var called = false;
                this.b._cameraControls.orbitObject = function(obj, speed) {
                    if (obj !== undefined && isNaN(speed) == false) called = true;
                }

                this.b._handleControls();

                assert.ok(called == false);
            });
        };
        
        return {run: run}
    }
);

