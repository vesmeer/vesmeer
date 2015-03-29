requirejs.config({
    baseUrl: 'Js/Lib',
    paths: {
        app: '../App',
        THREE: 'Vendor/three.min',
        THREExWindowResize: 'Vendor/THREEx.WindowResize',
        //THREETrackballControls: 'Vendor/THREE.TrackballControls',
        jquery: 'Vendor/jquery-1.11.0.min',
        moment: 'Vendor/moment',
        TWEEN: 'Vendor/tween',
        text: 'Vendor/text',
        Settings: '../Config/Settings',
    },
    //namespace: "Vesmeer",
    // Sets the configuration for your third party scripts that 
    // are not AMD compatible.
    shim: {
        'THREE': {
            exports: 'THREE', //attaches "THREE" to the window object.
        },
        'THREETrackballControls': {
            deps: ['THREE'],
            exports: 'THREE',
        },
        'THREExWindowResize': {
            exports: 'THREEx',
        },
        'TWEEN': {
            exports: 'TWEEN',
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(['../App/Main']);