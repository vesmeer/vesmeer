define(
    [
        "Utils/Utils"
    ],

    function(Utils) {

        /**
         * Implements the head on display (HUD).
         */
        function HUD() {
            /* The HUD data as key/value pair. */
            this.data = {};

            /* True when the object info panel is showing; false otherwise. */
            this._objectDescriptionShowing = false;

            /* True when the help panel is showing; false otherwise. */
            this._helpPanelShowing = false;
        }

        /* Available message window positions. */
        HUD.MESSAGE_POSITION = { CENTER: 1, BOTTOM: 2 };

        HUD.prototype.show = function() {
            $(".hud-panel").show();
        }

        HUD.prototype.hide = function() {
            $(".hud-panel").hide();
        }

        HUD.prototype.setCellContent = function(cellId, content) {
            $("#" + cellId).html(content);
        }

        HUD.prototype.hideCell = function(cellId) {
            $("#" + cellId).hide();
        }

        HUD.prototype.showCell = function(cellId) {
            $("#" + cellId).show();
        }

        HUD.prototype.isCellEmpty = function(cellId) {
            return $("#" + cellId).html() == '';
        }

        /**
         * Sets the HUD cells layout as specified in the html argument.
         */
        HUD.prototype.setCellsLayout = function(html) {
            $("body").append(html);
        }

        /**
         * Stores the value under the given key, so that the value can
         * later be retrieved and displayed on the HUD.
         */
        HUD.prototype.setData = function(key, value) {
            this.data[key] = value;
        }

        HUD.prototype.getData = function(key) {
            return this.data[key];
        }

        HUD.prototype.deleteData = function(key) {
            this.data[key] = undefined;
        }

        HUD.prototype.showMessage = function(text, durationMs, position, size) {
            switch (position) {
                case HUD.MESSAGE_POSITION.CENTER:
                    this.showMessageAtCenter(text, durationMs);
                    break;
                case HUD.MESSAGE_POSITION.BOTTOM:
                    this.showMessageAtBottom(text, durationMs, size);
                    break;
            }
        }

        /**
         * Shows a brief message at the HUD bottom and hides it after 
         * durationMs milisconds.
         */
        HUD.prototype.showMessageAtBottom = function(text, durationMs, size) {
            if (size === undefined) 
                var size = { width: 200, height: 30 }
            var self = this;
            var posLeft = window.innerWidth / 2.0 - size.width / 2.0;
            $("#hud-message-bottom").css({
                "min-width": size.width + "px",
                "min-height": size.height + "px",
                "bottom": "0px",
                "left": posLeft + "px"
            });
            $("#hud-message-bottom").stop();
            $("#hud-message-bottom").html(text);
            $("#hud-message-bottom").show(0).delay(durationMs).hide(0, function() {
                self.deleteData('message-box');
            });
        }

        /**
         * Shows a brief message at the HUD center and hides it after 
         * durationMs milisconds.
         */
        HUD.prototype.showMessageAtCenter = function(text, durationMs) {
            $("#hud-message-center").stop();
            $("#hud-message-center").remove(); 
            $("body").append('<div id="hud-message-center" style=""></div>');
            $("#hud-message-center").html("<pre>" + text + "</pre>");
            var posTop = window.innerHeight / 2.0 - $("#hud-message-center").height() / 2.0;
            var posLeft = window.innerWidth / 2.0 - $("#hud-message-center").width() / 2.0;
            $("#hud-message-center").css({
                "left": posLeft + "px",
                "top": posTop + "px",
            });
            var self = this;
            this._objectDescriptionShowing = true;
            $("#hud-message-center").show(0).delay(durationMs).fadeOut(500, function() {
                $("#hud-message-center").remove();
                self._objectDescriptionShowing = false;
            });
        }

        /**
         * Shows the scene object description information window.
         */
        HUD.prototype.showObjectDescription = function(text, durationMs) {
            // Remove object info that is currently be displayed, if any.
            $("#object-info").stop();
            $("#object-info").remove(); 
            $("body").append('<div id="object-info" style=""></div>');
            $("#object-info").html("<pre>" + text + "</pre>");
            var posTop = "10%";
            var posLeft = window.innerWidth / 6.0 - $("#object-info").width() / 2.0;
            $("#object-info").css({
                "left": posLeft + "px",
                "top": posTop,
            });
            var self = this;
            this._objectDescriptionShowing = true;
            $("#object-info").show(0).delay(durationMs).fadeOut(500, function() {
                $("#object-info").remove();
                self._objectDescriptionShowing = false;
            });
        }

        HUD.prototype.hideObjectDescription = function() {
            $("#object-info").remove();
            this._objectDescriptionShowing = false;
        }

        HUD.prototype.isObjectDescriptionShowing = function() {
            return this._objectDescriptionShowing;
        }

        /**
         * Toggles the help panel.
         */
        HUD.prototype.toggleHelp = function() {
            if (!this.isHelpShowing()) {
                $("#help-panel").remove(); 
                $("body").append('<div id="help-panel" style=""></div>');
                $("#help-panel").html([
                    '<table>', 
                    '<tr><td class="key">A</td><td class="value">Accelerate</td><td class="key">Enter</td><td class="value">Select object</td></tr>',
                    '<tr><td class="key">Z</td><td class="value">Decelerate</td><td class="key">G</td><td class="value">Go to selected object</td></tr>',
                    '<tr><td class="key">S</td><td class="value">Stop</td><td class="key">F</td><td class="value">Follow object</td></tr>',
                    '<tr><td class="key">Q</td><td class="value">Reverse direction</td><td class="key">T</td><td class="value">Track object</td></tr>',
                    '<tr><td class="key">Arrow Left</td><td class="value">Rotate camera counterclockwise</td><td class="key">Arrow Right</td><td class="value">Rotate camera clockwise</td></tr>',
                    '<tr><td class="key">Ctrl+Arrow Left</td><td class="value">Orbit clockwise</td><td class="key">Ctrl+Arrow Right</td><td class="value">Orbit counterclockwise</td></tr>',
                    '<tr><td class="key">I</td><td class="value">Toggle selected object description</td><td class="key">L</td><td class="value">Look at selected object</td></tr>',
                    '<tr><td class="key">X</td><td class="value">Toggle selected object axes</td><td class="key">E</td><td class="value">Toggle selected object equatorial plane</td></tr>',
                    '<tr><td class="key">H</td><td class="value">Toggle help</td><td class="key">F</td><td class="value">Toggle full screen</td></tr>',
                    '<tr><td class="key">[</td><td class="value">Dim stars</td><td class="key">]</td><td class="value">Brightnen stars</td></tr>',
                    '</table>'
                ].join('\n'));
                var posTop = window.innerHeight / 2 - $("#help-panel").height() / 2.0;
                var posLeft = window.innerWidth / 2 - $("#help-panel").width() / 2.0;
                $("#help-panel").css({
                    "left": posLeft + "px",
                    "top": posTop,
                });
                this._helpPanelShowing = true;
                $("#help-panel").show();
            }
            else {
                $("#help-panel").remove();
                this._helpPanelShowing = false;
            }
        }

        HUD.prototype.isHelpShowing = function() {
            return this._helpPanelShowing;
        }

        return (HUD);
    }
);
