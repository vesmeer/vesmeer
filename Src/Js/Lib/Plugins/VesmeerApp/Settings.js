define(

    function() {
        /**
         * VesmeerApp plugin settings.
         */

        var Settings = {
            
            /* Default camera *vertical* field of view angle (degrees). */
            DEFAULT_CAMERA_FOV: 40,

            /* Default rendering cutoff near plane distance. */
            DEFAULT_RENDERING_NEAR_PLANE: 1,

            /* Default rendering cutoff far plane distance. */
            DEFAULT_RENDERING_FAR_PLANE: 10e10,

            /* Speed at which the user accelerates the camera using
             * the camera moving controls [in km/s^2]. 
             */
            CAMERA_ACCELERATION: 50,

            /* Rate at which the user rotates the camera around using
             * camera moving controls [in degrees/s]. 
             */
            CAMERA_ROTATION_RATE: 50,

            /* A scaling factor by which each length/distance parameter in the
             * plugin will be multiplied, yielding an actual value that will 
             * be used to build the scene.
             */
            LENGTH_SCALING_FACTOR: 1,

            /* The name of the root scene object. */
            ROOT_SCENE_OBJECT_NAME: 'VesmeerApp.StarDome',
            
        }

        return (Settings);
    }
);
