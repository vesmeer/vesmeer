"use strict";

require.config({
    // Normally rlative to index.html, but we are using <base/> tag 
    // in index.html, so it's relative to the path in it.
    baseUrl: 'Js/Lib', 
    paths: {
        THREE: '../../Js/Lib/Vendor/three.min',
        THREExWindowResize: '../../Js/Lib/Vendor/THREEx.WindowResize',
        //THREETrackballControls: '../../Js/Lib/Vendor/THREE.TrackballControls',
        jquery: '../../Js/Lib/Vendor/jquery-1.11.0.min',
        moment: '../../Js/Lib/Vendor/moment',
        TWEEN: '../../Js/Lib/Vendor/tween',
        text: '../../Js/Lib/Vendor/text',
        Settings: '../../Js/Config/Settings',
        QUnit: '../../Test/Js/Libs/qunit'
    },
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
        },
        'QUnit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        } 
    }
});

// require the unit tests.
require(
    ['QUnit', '../../Test/Js/CoreSystemTests', '../../Test/Js/VesmeerAppTests'],
    function(QUnit, CoreSystemTests, VesmeerAppTests) {
        
        CoreSystemTests.run();
        VesmeerAppTests.run();
        
        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);
