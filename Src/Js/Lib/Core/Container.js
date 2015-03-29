define(
    
    function() {

        /**
         * Stores objects as key/value pairs.
         */
        var Container = {};

        Container._objects = [];

        Container.set = function(id, obj) {
            Container._objects[id] = obj;
        }

        Container.get = function(id) {
            return Container._objects[id];
        }

        return (Container);

    }
);