define(
    [
        "Core/Behavior",
        "Core/Container",
        "Core/Time",
        "Core/Unit",
        "Utils/Utils",
        "Plugins/VesmeerApp/Settings"
    ],

    function(Behavior, Container, Time, Unit, Utils, Settings) {

        function HUDBehavior() { }

        HUDBehavior.prototype = Object.create(Behavior.prototype);

        HUDBehavior.prototype.start = function() {
            this.scene = Container.get('scene');
            this.camera = Container.get('camera');
            this.rootSceneObject = this.scene.findObjectByName(
                Settings.ROOT_SCENE_OBJECT_NAME)
            this.hud = Container.get('hud');
            this.hud.show();
            this.objectPhysics = Container.get('object-physics');
            
            this.frameNum = 0;
        }

        HUDBehavior.prototype.update = function() {
            this.updateHUD();
        }

        /**
         * Find the camera position relative to the position of the scene 
         * object that is the root of the scene object hierarchy. That 
         * object's position defines the origin of the coordinate system.
         */
        HUDBehavior.prototype._findCameraPosition = function() {
            return new THREE.Vector3().subVectors(
                this.camera.position.clone(),
                this.rootSceneObject.position.clone()
            )
        }

        HUDBehavior.prototype.updateHUD = function() {
            if (this.scene.getSelectedObject() !== null) {
                this.frameNum += 1;
                if (this.frameNum % 30 == 0) {
                    this.hud.setCellContent(
                        'hud-panel-cell1', 
                        '<div style="font-size: 0.7em">SELECTED OBJECT</div>' +
                        '<div style="font-weight: bold;">' + 
                            this.scene.getSelectedObject().label.toUpperCase() + 
                        '</div>'
                    );
                    this.hud.setCellContent(
                        'hud-panel-cell2', 
                        '<div style="font-size: 0.7em">DATE & TIME</div>' +
                        '<div style="font-weight: bold;">' + 
                            Time.getSystemDateTime() + 
                        '</div>'
                    );
                    var cameraPos = this._findCameraPosition();
                    var positionValUnitsX = this.kmToLargerUnit(
                        Unit.rawToKm(cameraPos.x),
                        [Unit.UNIT_LS]
                    );
                    var positionValUnitsY = this.kmToLargerUnit(
                        Unit.rawToKm(cameraPos.y),
                        [Unit.UNIT_LS]
                    );
                    var positionValUnitsZ = this.kmToLargerUnit(
                        Unit.rawToKm(cameraPos.z),
                        [Unit.UNIT_LS]
                    );
                    this.hud.setCellContent(
                        'hud-panel-cell3', 
                        '<div style="font-size: 0.7em">CAMERA POSITION</div>' +
                        '<div style="font-weight: bold;">' + 
                            'x: ' + positionValUnitsX.length.toFixed(2) + ' ' +
                                positionValUnitsX.unit + '<br/>' +
                            'y: ' + positionValUnitsY.length.toFixed(2) + ' ' + 
                                positionValUnitsY.unit + '<br/>' +
                            'z: ' + positionValUnitsZ.length.toFixed(2) + ' ' + 
                                positionValUnitsZ.unit + '<br/>' +
                        '</div>'
                    );
                    var speedValUnits = this.kmToLargerUnit(
                        this.objectPhysics.getSpeed('main-camera')
                    );
                    this.hud.setCellContent(
                        'hud-panel-cell4', 
                        '<div style="font-size: 0.7em">SPEED</div>' +
                        '<div style="font-weight: bold;">' 
                            + parseFloat(speedValUnits.length).toFixed(2) + 
                            ' ' + this._lengthUnitToSpeed(speedValUnits.unit) +
                        '</div>'
                    );
                    var distanceValUnits = this.kmToLargerUnit(
                        Unit.rawToKm(this.findObjectDistance(
                            this.scene.getSelectedObject())),
                        [Unit.UNIT_LS]
                    );
                    this.hud.setCellContent(
                        'hud-panel-cell5', 
                        '<div style="font-size: 0.7em">DISTANCE</div>' +
                        '<div style="font-weight: bold;">' 
                            + distanceValUnits.length.toFixed(2) + ' ' + 
                            distanceValUnits.unit +
                        '</div>'
                    );
                    if (this.hud.getData('follow') !== undefined) {
                        this.hud.setCellContent(
                            'hud-panel-cell6', 
                            '<div style="font-size: 0.7em">FOLLOWING</div>' +
                            '<div style="font-weight: bold;">' 
                                + this.hud.getData('follow') +
                            '</div>'
                        );
                        this.hud.showCell('hud-panel-cell6');
                    }
                    else {
                        this.hud.setCellContent('hud-panel-cell6', '');
                        this.hud.hideCell('hud-panel-cell6');
                    }
                    if (this.hud.getData('track') !== undefined) {
                        this.hud.setCellContent(
                            'hud-panel-cell7', 
                            '<div style="font-size: 0.7em">TRACKING</div>' +
                            '<div style="font-weight: bold;">' 
                                + this.hud.getData('track') +
                            '</div>'
                        );
                        this.hud.showCell('hud-panel-cell7');
                    }
                    else {
                        this.hud.setCellContent('hud-panel-cell7', '');
                        this.hud.hideCell('hud-panel-cell7');
                    }
                }
            }

            /**
             * Converts from km to larger length units depending 
             * on the value. Returns the converted value and its unit. The 
             * units passed in skipUnits array will not be converted to. 
             * The previous smaller unit will be returned instead.
             */
            HUDBehavior.prototype.kmToLargerUnit = function(length, skipUnits) {
                var unit = Unit.UNIT_KM;
                var s;
                var unitIdx = 0;
                var units = [Unit.UNIT_KM, Unit.UNIT_LS, 
                    Unit.UNIT_AU, Unit.UNIT_LY];
                
                if (skipUnits === undefined) 
                    skipUnits = [];

                if (Math.abs(length) >= (Unit.ls / 10)) {
                    unit = units[++unitIdx];
                }
                if (Math.abs(length) >= (Unit.AU / 10)) {
                    unit = units[++unitIdx];
                }
                if (Math.abs(length) >= (Unit.ly / 10)) {
                    unit = units[++unitIdx];
                }
                if (jQuery.inArray(unit, skipUnits) > -1) {
                    unit = units[unitIdx - 1];
                }
                
                s = Unit.convertKmTo(length, unit);
                
                return { length: s, unit: unit }
            }

            HUDBehavior.prototype._lengthUnitToSpeed = function(unit) {
                if (unit == Unit.UNIT_LS)
                    return 'c';
                else if (unit == Unit.UNIT_KM)
                    return Unit.UNIT_KM + '/s';
                else if (unit == Unit.UNIT_AU)
                    return Unit.UNIT_AU + '/s';
                else if (unit == Unit.UNIT_LY)
                    return Unit.UNIT_LY + '/s';
            }

            HUDBehavior.prototype.findObjectDistance = function(object) {
                return object.findDistanceToSurface(this.camera);
            }
        }

        return (HUDBehavior);

    }
);
