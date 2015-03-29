define(

    function() {
        
        /**
         * Base class for scripts defining scene object behavior.
         */
        function Behavior() {

            /* Scene object owning this behavior object. */
            this.ownerSceneObject = null;

        }

        Behavior.prototype = {

            setOwnerSceneObject: function(ownerSceneObject) {
                this.ownerSceneObject = ownerSceneObject;
            },

            getOwnerSceneObject: function() {
                return this.ownerSceneObject;
            },

            /**
             * Called when the first frame is rendered.
             */
            start: function() {

            },

            /**
             * Called on every frame.
             */
            update: function() {

            }

        }

        return (Behavior);
    }
);