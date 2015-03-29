define(
    [
        "jquery", "Core/SceneObject", "Utils/Utils", "Utils/SoundUtils", 
        "text!Templates/SceneObjectGrabber.html", "Settings",
        "Core/EventListenerRegistrar"
    ],

    function(jquery, SceneObject, Utils, SoundUtils, 
        SceneObjectGrabberTemplate, Settings, EventListenerRegistrar) {

        /**
         * Handles looking up and activating scene objects as recipients
         * of user-invoked commands.
         */
        function SceneObjectGrabber(eventListenerRegistrar, scene) {
            this._eventListenerRegistrar = eventListenerRegistrar;
            this._scene = scene;
            this._availableSceneObjects = [];
            this._filteredSceneObjects = [];

            var self = this;
            this._onKeyPress = function(event) {
                event.stopPropagation(); 
                self._onKeyUp(event) 
            };
        }

        SceneObjectGrabber.prototype.run = function() {
            this._listenToKeyboard();
        }

        SceneObjectGrabber.prototype._listenToKeyboard = function() {
            this._eventListenerRegistrar.addListener(
                "keyup", 
                this._onKeyPress
            );
        }

        SceneObjectGrabber.prototype._onKeyUp = function(event) {
            if (event.keyCode == EventListenerRegistrar.KEY['ENTER']) {
                event.stopPropagation();
                this.startOrStop();
            }
        }

        /**
         * Starts the scene object grabber by disabling potentially 
         * conflicting event listeners and opening the relevant 
         * GUI window. If the scene object grabber is already activated,
         * it restores the original event listeners and closes the GUI.
         */
        SceneObjectGrabber.prototype.startOrStop = function() {
            if (!this._isActive()) {
                this._eventListenerRegistrar.suspendListenersExcept([
                    {"keyup": this._onKeyPress}
                ]);
                this.activate();
            }
            else {
                this._eventListenerRegistrar.resumeListeners();
                this._setSelectedObject();
                this.deactivate();
            }
        }

        /**
         * Returns true if the scene object grabber GUI window is open.
         */
        SceneObjectGrabber.prototype._isActive = function() {
            return $("#SceneObjectGrabber").length;
        }

        /**
         * Opens the GUI window, populates it with available scene objects,
         * and listens to the user's input.
         */
        SceneObjectGrabber.prototype.activate = function() {
            SoundUtils.playSound(SoundUtils.SOUNDS.WindowOpen);
            this._showGUIWindow();
            this._populateSuggestions();
        }

        SceneObjectGrabber.prototype._showGUIWindow = function() {
            $("body").append(SceneObjectGrabberTemplate);
            var size = { width: 800, height: 300 }
            var posBottom = window.innerHeight / 2.0 - size.height / 2.0;
            var posLeft = window.innerWidth / 2.0 - size.width / 2.0;
            $("#SceneObjectGrabber").css({
                "bottom": posBottom + "px",
                "left": posLeft + "px",
                "width": size.width + "px",
                "min-height": size.height + "px",
            });
            var self = this;
            $("#SceneObjectGrabber .SearchInput").keyup(function() {
                self._filteredSceneObjects = self.filter($(this).val());
            });
            $("#SceneObjectGrabber").show();
            $("#SceneObjectGrabber .SearchInput").focus();
        }

        /**
         * Inspects the array of filtered scene objects and once the user 
         * narrows his/her selection to a single scene object, it sets it 
         * as the selected one.
         */
        SceneObjectGrabber.prototype._setSelectedObject = function() {
            if (this._filteredSceneObjects.length == 1) {
                this._scene.setSelectedObject(this._filteredSceneObjects[0]);
                SoundUtils.playSound(SoundUtils.SOUNDS.WindowClose);
            }
        }

        /**
         * Populates the scene object selection window with options.
         */
        SceneObjectGrabber.prototype._populateSuggestions = function() {
            this._retrieveAvailableSceneObjects();
            this._insertSuggestions(this._availableSceneObjects)
        }

        SceneObjectGrabber.prototype._retrieveAvailableSceneObjects = function() {
            var self = this;
            
            this._availableSceneObjects = [];
            this._scene.traverse(function(child) {
                if (child instanceof SceneObject &&
                        child.name != 'VesmeerApp.StarDome') {
                    self._availableSceneObjects.push(child);
                }
            });
        }

        SceneObjectGrabber.prototype._insertSuggestions = function(sceneObjects) {
            $("#SceneObjectGrabber .Suggestions").empty();
            for(var i = 0; i < sceneObjects.length; i++) {
                $("#SceneObjectGrabber .Suggestions").append(
                    '<div class="suggestion">' + sceneObjects[i].label + '</div>'
                );
            }
        }

        /**
         * Filters the presented screen objects using the filterText.
         * The newly listed screen objects' labels must match the
         * filterText in a regular expression sense. Returns the filtered
         * scene objects.
         */
        SceneObjectGrabber.prototype.filter = function(filterText) {
            var filteredObjs = this._filterSceneObjects(
                this._availableSceneObjects, 
                filterText
            );
            this._insertSuggestions(filteredObjs);

            return filteredObjs;
        }

        /**
         * Returns the scene objects whose label matches the regex built 
         * from filterText.
         */
        SceneObjectGrabber.prototype._filterSceneObjects = function(sceneObjects, filterText) {
            var matchingSceneObjects = [];
            
            var reg = new RegExp(this._buildRegexPattern(filterText), "i");
            for(var i = 0; i < sceneObjects.length; i++) {
                if (this._isExactMatch(sceneObjects[i].label, filterText)) {
                    matchingSceneObjects = [sceneObjects[i]];
                    break;
                }
                if (reg.test(sceneObjects[i].label)) {
                    matchingSceneObjects.push(sceneObjects[i]);
                }
            }

            return matchingSceneObjects;
        }

        SceneObjectGrabber.prototype._isExactMatch = function(sceneObjectLabel, filterText) {
            return sceneObjectLabel.toLowerCase() == filterText.toLowerCase();
        }

        SceneObjectGrabber.prototype._buildRegexPattern = function(text) {
            var pattern = '';

            for(var l = 0; l < text.length; l++) {
                pattern += text[l] + '+.*';
            }

            return pattern;
        }

        SceneObjectGrabber.prototype.deactivate = function() {
            $("#SceneObjectGrabber").hide().remove();
        }

        SceneObjectGrabber.prototype.getSelectedObject = function() {
            return this.selectedSceneObject;
        }

        return (SceneObjectGrabber);
        
    }
);
