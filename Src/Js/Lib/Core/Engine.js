define(
    [
        "THREE", "THREExWindowResize", "Core/SceneObject", "Core/Time", 
        "Core/Container", "Core/PluginManager", "Vendor/THREEx.KeyboardState",
        "Core/SceneObjectGrabber", "Core/EventListenerRegistrar", 
        "Core/Scene", "Core/ObjectPhysics", "Core/LoadSplashScreen", "Settings"
    ], 

    function(THREE, THREExWindowResize, SceneObject, Time, Container, 
        PluginManager, KeyboardState, SceneObjectGrabber,
        EventListenerRegistrar, Scene, ObjectPhysics, LoadSplashScreen, 
        Settings) {

        /**
         * Creates and initializes the scene, renderer, and other 
         * core objects.
         */
        function Engine() {
            this._paused = false;
            this._pluginManager = null;
            // Three.js objects.
            this._scene = null;
            this._camera = null;
            this._renderer = null;
            this._keyboard = null;
            this._sceneObjectGrabber = null;
            this._objectPhysics = null;
        }

        Engine.prototype.init = function() {
            this._initScene();
            this._initRenderer();
            this._initPluginManager();
            this._initEventListenerRegistrar();
            this._initKeyboard();
            this._initSceneObjectGrabber();
            this._initObjectPhysics();
            this._loadPlugins();
            this._objectPhysics.registerObject(this._camera);
        }

        Engine.prototype._initObjectPhysics = function() {
            this._objectPhysics = new ObjectPhysics();
            Container.set('object-physics', this._objectPhysics);
        }

        Engine.prototype._initKeyboard = function() {
            this.keyboard = new KeyboardState();
            Container.set('keyboard', this.keyboard);
        }

        Engine.prototype.addEventHandler = function(eventType, handler) {
            this.eventHandlers[eventType].push(handler);
        }

        Engine.prototype._initScene = function() {
            this._scene = new Scene();
            Container.set('scene', this._scene);
        }

        Engine.prototype._initPluginManager = function() {
            this._pluginManager = new PluginManager();
        }

        Engine.prototype._initEventListenerRegistrar = function() {
            this.eventListenerRegistrar = new EventListenerRegistrar();
            Container.set('event-listener-registrar', 
                this.eventListenerRegistrar);
        }

        Engine.prototype._initRenderer = function() {
            this._renderer = new THREE.WebGLRenderer({
                antialias : true,   // to get smoother output,
                precision: 'highp',
                logarithmicDepthBuffer: false,
                alpha: false,
                preserveDrawingBuffer: false
            });
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            if (Settings.SHADOWS) {
                this._renderer.shadowMapEnabled = true;
                this._renderer.shadowMapSoft = true;
                this._renderer.shadowMapType = THREE.PCFSoftShadowMap;
            }
            else {
                this._renderer.shadowMapEnabled = false;
                this._renderer.shadowMapSoft = false;                
            }
            document.body.appendChild(this._renderer.domElement);   
        }

        /**
         * Renders the scene.
         */
        Engine.prototype.render = function() {
            var _this = this;
            var behaviors = this._getSceneObjectsBehaviors();
            var clock = new THREE.Clock();

            // Resizes the window canvas when the browser window is resized.
            THREEx.WindowResize(this._renderer, this._camera);
            this._callBehaviorsStart(behaviors);

            var animate = function() {
                if (_this._paused) {
                    setTimeout(animate, 100);
                    return;
                }
                _this._objectPhysics.update();
                _this._measureFrameAndElapsedTime(clock);
                TWEEN.update();
                //_this._controls.update();
                _this._pluginManager.callPluginsUpdate();
                _this._callBehaviorsUpdate(behaviors);
                requestAnimationFrame(animate);
                _this._renderer.render(_this._scene, _this._camera); 
            }

            // Show loader progress bar until all textures are loaded.
            LoadSplashScreen.show();
            THREE.DefaultLoadingManager.onProgress = function(item, loaded, total) {
                // console.log(loaded, total, loaded / total * 100);
                LoadSplashScreen.update(loaded / total * 100);
                if (loaded === total) {
                    LoadSplashScreen.hide();
                    animate();
                    _this._scene.setLoaded(true);
                }
            };
        }

        Engine.prototype._getSceneObjectsBehaviors = function() {
            var behaviors = [];

            this._scene.traverse(function(child) {
                if ('behaviors' in child) {
                    behaviors.push.apply(
                        behaviors, 
                        child.getBehaviors()
                    );
                }
            });
            
            return behaviors;
        }

        Engine.prototype._measureFrameAndElapsedTime = function(clock) {
            Time.frameTime = clock.getDelta();
            Time.elapsedTime = clock.getElapsedTime();
        }

        Engine.prototype._callBehaviorsUpdate = function(behaviors) {
            if (behaviors.length > 0) {
                for (var bIdx in behaviors) {
                    behaviors[bIdx].update();
                }
            }
        }

        Engine.prototype._callBehaviorsStart = function(behaviors) {
            if (behaviors.length > 0) {
                for (var bIdx in behaviors) {
                    behaviors[bIdx].start();
                }
            }
        }

        Engine.prototype.pause = function(trueFalse) {
            this._paused = trueFalse
        }

        Engine.prototype._loadPlugins = function() {
            this._pluginManager.loadPlugins(this);
        }

        Engine.prototype._initSceneObjectGrabber = function() {
            this._sceneObjectGrabber = new SceneObjectGrabber(
                this.eventListenerRegistrar, 
                this._scene
            );
            this._sceneObjectGrabber.run();
        }

        Engine.prototype.getCamera = function() {
            return this._camera;
        }

        Engine.prototype.setCamera = function(camera) {
            this._camera = camera;
        }

        Engine.prototype.getScene = function() {
            return this._scene;
        }

        Engine.prototype.getKeyboard = function() {
            return this._keyboard;
        }

        Engine.prototype.getObjectPhysics = function() {
            return this._objectPhysics;
        }

        return (Engine);
    }
);
