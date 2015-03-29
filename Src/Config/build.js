({
    baseUrl: "../Js/Lib",
    name: "../App/Main",
    out: "../../Build/Vesmeer.js",
        paths: {
        app: '../App',
        THREE: 'Vendor/three.min',
        THREExWindowResize: 'Vendor/THREEx.WindowResize',
        jquery: 'Vendor/jquery-1.11.0.min',
        moment: 'Vendor/moment',
        TWEEN: 'Vendor/tween',
        text: 'Vendor/text',
        Settings: '../Config/Settings',
    },
    //namespace: "Vesmeer",
    shim: {
        'THREE': {
            exports: 'THREE',
        }, 
        'THREETrackballControls': {
            deps: ['THREE'],
            exports: 'THREE',
        },
        'THREExWindowResize': {
            exports: 'THREEx',
        },
        'Settings': {
            exports: 'Settings',
        },
        'TWEEN': {
            exports: 'TWEEN',
        }
    },
    //optimize: "none"
})