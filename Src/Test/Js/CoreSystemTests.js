"use strict";

define(
    ['Core/Engine', 'Core/Container', 'THREE', 'Core/SceneObject', 
     'Core/Behavior', 'Core/Time', 'Core/CameraControls', 'Utils/Utils'],
    function(Engine, Container, THREE, SceneObject, Behavior, Time,
        CameraControls, Utils) {

        var run = function() {
            module("Engine", {
                setup: function(assert) {
                    this.e = new Engine();
                }, 
                teardown: function() {

                }
            });
            test('init() initiates component objects.', function(assert) {
                this.e.init();
                assert.ok(Container.get('scene'));
                assert.ok(document.getElementsByTagName('canvas')[0] !== undefined);
                assert.ok(this.e._pluginManager !== undefined);
                assert.ok(Container.get('event-listener-registrar'));
                assert.ok(Container.get('keyboard'));
                assert.ok(this.e._sceneObjectGrabber !== undefined);
                assert.ok(Container.get('object-physics'));
                assert.ok(this.e._pluginManager._plugins.length > 0);
            });
            test('init() registers the scene camera for dynamic properties tracking', function(assert) {
                this.e.init();
                assert.ok(this.e._objectPhysics._objects[this.e.getCamera().name]);
            });
            test('_getSceneObjectsBehaviors() returns array of Behavior instances', function(assert) {
                this.e._initScene();
                var sceneObj = new SceneObject('name');
                this.e.getScene().add(sceneObj);

                assert.equal(this.e._getSceneObjectsBehaviors().length, 0);

                sceneObj.addBehavior(new Behavior());
                sceneObj.addBehavior(new Behavior());
                sceneObj.addBehavior(new Behavior());

                assert.equal(this.e._getSceneObjectsBehaviors().length, 3);
            });
            test('_measureFrameAndElapsedTime() returns non-zero elapsed time and frameTime after consecutive calls', function(assert) {
                var clock = new THREE.Clock();
                
                // Initially set to 1.0 on purpose for mathematical reasons.
                assert.equal(Time.frameTime, 1.0);
                assert.equal(Time.elapsedTime, 0.0);
                this.e._measureFrameAndElapsedTime(new THREE.Clock());
                assert.ok(Time.frameTime > 0);
                this.e._measureFrameAndElapsedTime(clock);
                assert.ok(Time.elapsedTime > 0);
                this.e._measureFrameAndElapsedTime(clock);
                assert.ok(Time.elapsedTime > 0);
            });
            test('_callBehaviorsStart() calls the start() method of all Behavior objects', function(assert) {
                var beh = new Behavior()
                beh.start = function() {
                    fixture.append("<div>yes</div>");
                }
                var fixture = $("#qunit-fixture");
                var behaviors = [beh];
                
                this.e._callBehaviorsStart(behaviors);
                assert.equal($("div", fixture).length, 1);
            });
            test('_callBehaviorsUpdate() calls the update() method of all Behavior objects', function(assert) {
                var beh = new Behavior()
                beh.update = function() {
                    fixture.append("<div>yes</div>");
                }
                var fixture = $("#qunit-fixture");
                var behaviors = [beh];
                
                this.e._callBehaviorsUpdate(behaviors);
                assert.equal($("div", fixture).length, 1);
            });



            module("CameraControls", {
                setup: function(assert) {
                    var camera = new THREE.PerspectiveCamera(
                        40, 
                        window.innerWidth / window.innerHeight, 
                        1, 
                        10e10
                    );
                    this.cc = new CameraControls(camera, new SceneObject('sceneobject'));
                }, 
                teardown: function() {
                    
                }
            });
            test('toggleDollyDirection() toggles the this.dollyForward direction variable', function(assert) {
                this.cc.toggleDollyDirection();
                assert.ok(!this.cc._dollyForward);
                this.cc.toggleDollyDirection();
                assert.ok(this.cc._dollyForward);
            });
            test('clampCameraDistanceFromOrigin() shifts the camera to the origin of coordinate system and shifts the scene correspondingly', function(assert) {
                this.cc._rootSceneObject.position.set(0, 0, 0);
                this.cc._camera.position.set(0, 0, 0);

                var displacement = 100000000;
                this.cc._camera.translateX(displacement);
                
                assert.ok(this.cc._rootSceneObject.position.equals(new THREE.Vector3(0, 0, 0)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(displacement, 0, 0)));

                this.cc.clampCameraDistanceFromOrigin();

                assert.ok(this.cc._rootSceneObject.position.equals(new THREE.Vector3(-displacement, 0, 0)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(0, 0, 0)));
            });
            test('clampCameraDistanceFromOrigin() does nothing for camera translations below threshold value', function(assert) {
                this.cc._rootSceneObject.position.set(0, 0, 0);
                this.cc._camera.position.set(0, 0, 0);
                
                var displacement = 10000;
                this.cc._camera.translateX(displacement);
            
                assert.ok(this.cc._rootSceneObject.position.equals(new THREE.Vector3(0, 0, 0)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(displacement, 0, 0)));
                
                this.cc.clampCameraDistanceFromOrigin();

                assert.ok(this.cc._rootSceneObject.position.equals(new THREE.Vector3(0, 0, 0)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(displacement, 0, 0)));
            });
            test('rotateZ() should rotate the camera by the given amount', function(assert) {
                this.cc.rotateZ(90);        
                assert.equal(Math.round(this.cc._camera.rotation._z, 3), Math.round(Math.PI / 2, 3));
                
                this.cc.rotateZ(-90);
                assert.equal(Math.round(this.cc._camera.rotation._z, 3), 0);

                this.cc.rotateZ(0);
                assert.equal(Math.round(this.cc._camera.rotation._z, 3), 0);

                this.cc.rotateZ(450);
                assert.equal(Math.round(this.cc._camera.rotation._z, 3), Math.round(Math.PI / 2, 3));
            });
            test('rotateX() should rotate the camera by the given amount', function(assert) {
                this.cc.rotateX(90);
                assert.equal(Math.round(this.cc._camera.rotation._x, 3), Math.round(Math.PI / 2, 3));
                
                this.cc.rotateX(-90);
                assert.equal(Math.round(this.cc._camera.rotation._x, 3), 0);

                this.cc.rotateX(0);
                assert.equal(Math.round(this.cc._camera.rotation._x, 3), 0);

                this.cc.rotateX(450);
                assert.equal(Math.round(this.cc._camera.rotation._x, 3), Math.round(Math.PI / 2, 3));
            });
            test('getCameraLookingDirection() should return a unit vector pointing in the direction where the camera is looking', function(assert) {
                assert.ok(this.cc.getCameraLookingDirection(this.cc._camera)
                    .equals(new THREE.Vector3(0, 0, -1)));

                this.cc._camera.rotateY(Math.PI / 2);
                assert.ok(
                    Utils.vectorsDiffLessThan(
                        this.cc.getCameraLookingDirection(this.cc._camera), 
                        new THREE.Vector3(-1, 0, 0),
                        0.005
                    )
                );

                this.cc._camera.rotateY(Math.PI / 4);
                assert.ok(
                    Utils.vectorsDiffLessThan(
                        this.cc.getCameraLookingDirection(this.cc._camera), 
                        new THREE.Vector3(-0.707, 0, 0.707),
                        0.005
                    )
                );
            });
            test('drawLine() should draw line between the two vectors', function(assert) {
                var owner = new SceneObject('sceneobject');
                this.cc.drawLine(
                    owner,
                    new THREE.Vector3(0, 10, 0),
                    new THREE.Vector3(10, 0, 0)
                );

                assert.ok(owner.children[0].geometry.vertices[0].equals(
                    new THREE.Vector3(0, 10, 0)));
                assert.ok(owner.children[0].geometry.vertices[1].equals(
                    new THREE.Vector3(10, 0, 0)));
            });
            test('orbitObject() orbits the given scene object', function(assert) {
                /* TODO: This function is incomplete. It doesn't work properly when
                   the camera doesn't initially face the scene object. */

                // 180 degrees.
                var object = new SceneObject('sceneobject');
                this.cc._camera.position.set(0, 0, 1);
                this.cc.orbitObject(
                    object,
                    180
                );
                assert.ok(
                    Utils.vectorsDiffLessThan(
                        this.cc._camera.position,
                        new THREE.Vector3(0, 0, -1),
                        0.005
                    )
                );

                // additinal 90 degrees.
                var object = new SceneObject('sceneobject');
                this.cc.orbitObject(
                    object,
                    90
                );
                assert.ok(
                    Utils.vectorsDiffLessThan(
                        this.cc._camera.position,
                        new THREE.Vector3(-1, 0, 0),
                        0.005
                    )
                );
            });
            test('setPosition() should set the camera to the position by moving the world in the opposite direction', function(assert) {
                this.cc.setPosition(new THREE.Vector3(1000, 100, 10));

                assert.ok(this.cc._camera.position.clone().equals(
                    new THREE.Vector3(0, 0, 0)));
                assert.ok(this.cc._rootSceneObject.position.clone().equals(
                    new THREE.Vector3(-1000, -100, -10)));
            });
            // TODO: For some reason tweening doesn't work when the function that uses tweening 
            // is called from here.
            // test('goToObject() should go to the vicinity of the scene object', function(assert) {
            //     // var done = assert.async();
            //     var obj = new SceneObject('sceneobject');
            //     obj.mesh = new THREE.Mesh(
            //         new THREE.SphereGeometry(1000, 50, 50),
            //         new THREE.MeshLambertMaterial({ 
            //             color: '#ffffff' 
            //         })
            //     );
            //     obj.getMeshes = function() {
            //         return [this.mesh];
            //     }
            //     obj.position.set(1000000, 0, 0);

            //     this.cc.goToObject(this.cc._camera, obj, function() {
            //         assert.ok(true);
            //         // assert.ok(this.cc._camera.position.equals(
            //         //     new THREE.Vector3(0, 0, 0)));
            //         // assert.ok(this.cc._rootSceneObject.position.equals(
            //         //     new THREE.Vector3(-100000, 0, 0)));
            //         done();
            //     });
            // });
            test('lookAt()) should point the camera at the target position point in space', function(assert) {
                this.cc.lookAt(new THREE.Vector3(1, 0, -1), 0, null);
                assert.ok(
                    Utils.vectorsDiffLessThan(
                        this.cc.getCameraLookingDirection(),
                        new THREE.Vector3(0.707, 0, -0.707),
                        0.005
                    )
                );
            });
            // TODO: For some reason tweening doesn't work when the function that uses tweening 
            // is called from here.
            // test('lookAt()) should point the camera at the target position point in space (tween)', function(assert) {
            //     this.cc.lookAt(this.cc._camera, new THREE.Vector3(1000, 0, -1000), 500, function() {
            //         assert.equal(
            //             Math.round(this.cc._camera.rotation._y, 3), 
            //             Math.round(-Math.PI/4, 3));
            //         });
            // });
            test('_followObject() should move the camera along with the moving scene object', function(assert) {
                var obj = new SceneObject('sceneobject');
                this.cc._followedObject = obj;
                this.cc._followedObjectPrevPos = new THREE.Vector3(0, 0, 0);

                assert.ok(obj.position.equals(new THREE.Vector3(0, 0, 0)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(0, 0, 0)));

                obj.translateZ(-1000);
                this.cc._followObject();

                assert.ok(obj.position.equals(new THREE.Vector3(0, 0, -1000)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(0, 0, -1000)));
            });
            test('_followObject() should not move the camera when called the first time', function(assert) {
                var obj = new SceneObject('sceneobject');
                this.cc._followedObject = obj;

                obj.translateZ(-1000);
                this.cc._followObject();
                
                assert.ok(obj.position.equals(new THREE.Vector3(0, 0, -1000)));
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(0, 0, 0)));
            });
            test('_followObject() should do nothing when the object to follow is not selected', function(assert) {
                this.cc._followObject();
                assert.ok(this.cc._camera.position.equals(new THREE.Vector3(0, 0, 0))); 
            });
            test('_trackObject() should keep pointing camera at the moving object', function(assert) {
                var obj = new SceneObject('sceneobject');
                obj.position.set(0, 0, -1000);
                this.cc._trackedObject = obj;

                assert.ok(this.cc.getCameraLookingDirection(
                    this.cc._camera).equals(new THREE.Vector3(0, 0, -1)));
                obj.translateX(1000);
                this.cc._trackObject();
                assert.ok(
                    Utils.vectorsDiffLessThan(
                        this.cc.getCameraLookingDirection(this.cc._camera),
                        new THREE.Vector3(0.707, 0, -0.707),
                        0.005
                    )
                );
            });
            test('_trackObject() should do nothing when the object to track is not selected', function(assert) {
                this.cc._trackObject();
                assert.ok(this.cc.getCameraLookingDirection(
                    this.cc._camera).equals(new THREE.Vector3(0, 0, -1)));
                
            });
            test('getStatus().FollowingObject should return FollowingObject when this._followedObject is not null', function(assert) {
                this.cc._followedObject = new SceneObject('sceneobject');
                assert.equal(this.cc.getStatus().FollowingObject, true);
            });
            test('getStatus().TrackingObject should return TrackingObject when this._trackedObject is not null', function(assert) {
                this.cc._trackedObject = new SceneObject('sceneobject');
                assert.equal(this.cc.getStatus().TrackingObject, true);
            });
            test('increaseTranslationSpeed() should add to the translation speed', function(assert) {
                assert.equal(this.cc.getTranslationSpeed(), 0);
                this.cc.increaseTranslationSpeed(5);
                assert.equal(this.cc.getTranslationSpeed(), 5);
            });
            test('_dolly() should move the camera back or forth by the amount corresponding to this._translationSpeed', function(assert) {
                assert.ok(this.cc._camera.position.equals(
                    new THREE.Vector3(0, 0, 0)));
            
                this.cc._translationSpeed = 0;
                this.cc._dolly();
                
                assert.ok(this.cc._camera.position.equals(
                    new THREE.Vector3(0, 0, 0)));

                this.cc._translationSpeed = 50;
                this.cc._dolly();
                
                assert.ok(this.cc._camera.position.equals(
                    new THREE.Vector3(0, 0, -50)));

                this.cc._camera.position.set(0, 0, 0);
            });
        };
        
        return {run: run}
    }
);
